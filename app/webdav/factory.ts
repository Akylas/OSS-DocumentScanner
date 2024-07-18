import { setupAuth } from './auth/index';
import { copyFile } from './operations/copyFile';
import { createDirectory } from './operations/createDirectory';
import { customRequest } from './operations/customRequest';
import { deleteFile } from './operations/deleteFile';
import { exists } from './operations/exists';
import { lock, unlock } from './operations/lock';
import { getQuota } from './operations/getQuota';
import { getStat } from './operations/stat';
import { getSearch } from './operations/search';
import { moveFile } from './operations/moveFile';
import { getFileUploadLink, putFileContents } from './operations/putFileContents';
import { File, path } from '@nativescript/core';
import {
    AuthType,
    BufferLike,
    CreateDirectoryOptions,
    DAVResult,
    FileStat,
    GetDirectoryContentsOptions,
    GetFileContentsOptions,
    GetQuotaOptions,
    Headers,
    LockOptions,
    PutFileContentsOptions,
    RequestOptions,
    ResponseDataDetailed,
    SearchOptions,
    StatOptions,
    // WebDAVClient,
    WebDAVClientContext,
    WebDAVClientOptions,
    WebDAVMethodOptions
} from './types';
import { prepareRequestOptions, request } from './request';
import { encodePath, makePathAbsolute, normalisePath } from './tools/path';
import { normaliseHREF } from './tools/url';
import { handleResponseCode, processResponsePayload } from './response';
import { parseXML, prepareFileFromProps } from './tools/dav';
import { HttpsResponse, HttpsResponseLegacy } from '@nativescript-community/https';
import { fromBase64 } from './tools/encode';
import { SEPARATOR } from '~/utils/constants';

const DEFAULT_CONTACT_HREF = 'mail:contact@akylas.fr';

async function _getFileContentsBuffer(context: WebDAVClientContext, filePath: string, options: GetFileContentsOptions = {}): Promise<HttpsResponse<HttpsResponseLegacy<any>>> {
    const requestOptions = prepareRequestOptions(
        {
            url: filePath.startsWith('http') ? filePath : path.join(context.remoteURL, encodePath(filePath)),
            method: 'GET'
        },
        context,
        options
    );
    const response = await request(requestOptions);
    await handleResponseCode(context, response, requestOptions);
    return response;
}

function getDirectoryFiles(result: DAVResult, serverRemoteBasePath: string, requestedRemotePath: string, isDetailed: boolean = false, includeSelf: boolean = false): FileStat[] {
    const serverBase = path.join(serverRemoteBasePath, SEPARATOR);
    // Extract the response items (directory contents)
    const {
        multistatus: { response: responseItems }
    } = result;

    // Map all items to a consistent output structure (results)
    const nodes = responseItems.map((item) => {
        // HREF is the file path (in full)
        const href = normaliseHREF(item.href);
        // Each item should contain a stat object
        const {
            propstat: { prop: props }
        } = item;
        // Process the true full filename (minus the base server path)
        const filename = serverBase === SEPARATOR ? decodeURIComponent(normalisePath(href)) : decodeURIComponent(normalisePath(path.join(serverBase, href)));
        return prepareFileFromProps(props, filename, isDetailed);
    });

    // If specified, also return the current directory
    if (includeSelf) {
        return nodes;
    }

    // Else, filter out the item pointing to the current directory (not needed)
    return nodes.filter((item) => item.basename && (item.type === 'file' || item.filename !== requestedRemotePath));
}

type Response<V extends 'binary' | 'text' | 'file' = 'binary'> = V extends 'file' ? File : V extends 'text' ? string : BufferLike;

export class WebDAVClient {
    constructor(public context: WebDAVClientContext) {}
    copyFile = (filename: string, destination: string, options?: WebDAVMethodOptions) => copyFile(this.context, filename, destination, options);
    createDirectory = (path: string, options?: CreateDirectoryOptions) => createDirectory(this.context, path, options);
    customRequest = (path: string, requestOptions: RequestOptions) => customRequest(this.context, path, requestOptions);
    deleteFile = (filename: string, options?: WebDAVMethodOptions) => deleteFile(this.context, filename, options);
    exists = (path: string, options?: WebDAVMethodOptions) => exists(this.context, path, options);
    async getDirectoryContents(remotePath: string, options: GetDirectoryContentsOptions = {}) {
        const context = this.context;
        const _remotePath = remotePath.startsWith('http') ? remotePath : path.join(context.remoteURL, encodePath(remotePath));
        // if (!_remotePath.endsWith(SEPARATOR)) {
        //     _remotePath += SEPARATOR;
        // }
        DEV_LOG && console.log('getDirectoryContent', _remotePath);
        const requestOptions = prepareRequestOptions(
            {
                url: _remotePath,
                method: 'PROPFIND' as any,
                headers: {
                    Accept: 'text/plain,application/xml',
                    Depth: !!options.deep ? 'infinity' : '1'
                }
            },
            context,
            options
        );
        const response = await request(requestOptions);
        DEV_LOG && console.log('getDirectoryContent done', _remotePath);
        await handleResponseCode(context, response, requestOptions);
        const responseData = await response.content.toStringAsync();
        if (!responseData) {
            throw new Error('Failed parsing directory contents: Empty response');
        }
        const davResp = await parseXML(responseData);
        const remoteBasePath = context.remoteBasePath;
        const files = getDirectoryFiles(davResp, remoteBasePath, _remotePath, options.details, options.includeSelf);
        // if (options.glob) {
        //     files = processGlobFilter(files, options.glob);
        // }
        return processResponsePayload(response, files, options.details);
    }
    async getFileContents<U extends boolean = false, V extends 'binary' | 'text' | 'file' = 'binary'>(
        filePath: string,
        options: GetFileContentsOptions & { details?: U; format?: V } = {}
    ): Promise<U extends true ? ResponseDataDetailed<Response<V>> : Response<V>> {
        const context = this.context;
        const { format = 'binary' } = options;
        const response = await _getFileContentsBuffer(context, filePath, options);
        let body;
        switch (format) {
            case 'binary':
                body = await response.content.toArrayBufferAsync();
                break;
            case 'text':
                body = await response.content.toStringAsync();
                break;
            case 'file':
                body = await response.content.toFile(options.destinationFilePath);
                break;
            default:
                throw new Error(`Invalid output format: ${format}`);
        }
        // DEV_LOG && console.log('getFileContents', format, body);
        return processResponsePayload(response, body, options.details);
    }
    async getFileDownloadLink(filePath: string) {
        const context = this.context;
        let url = path.join(context.remoteURL, encodePath(filePath));
        const protocol = /^https:/i.test(url) ? 'https' : 'http';
        switch (context.authType) {
            case AuthType.None:
                // Do nothing
                break;
            case AuthType.Password: {
                const authPart = context.headers.Authorization.replace(/^Basic /i, '').trim();
                const authContents = fromBase64(authPart);
                url = url.replace(/^https?:\/\//, `${protocol}://${authContents}@`);
                break;
            }
            default:
                throw new Error(`Unsupported auth type for file link: ${context.authType}`);
        }
        return url;
    }
    getHeaders = () => Object.assign({}, this.context.headers);
    getQuota = (options?: GetQuotaOptions) => getQuota(this.context, options);
    lock = (path: string, options?: LockOptions) => lock(this.context, path, options);
    moveFile = (filename: string, destinationFilename: string, options?: WebDAVMethodOptions) => moveFile(this.context, filename, destinationFilename, options);
    putFileContents = (filename: string, data: string | BufferLike | File /*  | Stream.Readable */, options?: PutFileContentsOptions) => putFileContents(this.context, filename, data, options);
    search = (path: string, options?: SearchOptions) => getSearch(this.context, path, options);
    setHeaders = (headers: Headers) => {
        this.context.headers = Object.assign({}, headers);
    };
    stat = (path: string, options?: StatOptions) => getStat(this.context, path, options);
    unlock = (path: string, token: string, options?: WebDAVMethodOptions) => unlock(this.context, path, token, options);
}

export function createContext(remoteURL: string, options: WebDAVClientOptions = {}) {
    const {
        authType: authTypeRaw = null,
        remoteBasePath: remoteBasePathRaw,
        contactHref = DEFAULT_CONTACT_HREF,
        ha1,
        headers = {},
        httpAgent,
        httpsAgent,
        password,
        token,
        username
        // withCredentials
    } = options;
    let authType = authTypeRaw;
    if (!authType) {
        authType = username || password ? AuthType.Password : AuthType.None;
    }
    let remoteBasePath = remoteBasePathRaw;
    if (!remoteURL.startsWith('http')) {
        remoteURL = 'https://' + remoteURL;
    }
    if (!remoteBasePath) {
        const array = remoteURL.split('//');
        remoteBasePath = array[0] + '//' + array[1].split(SEPARATOR)[0];
    }
    const context = {
        authType,
        remoteBasePath,
        contactHref,
        ha1,
        headers: headers || {},
        httpAgent,
        httpsAgent,
        // password, // dont store the password!
        remotePath: remoteURL,
        remoteURL,
        token,
        username
        // withCredentials
    } as WebDAVClientContext;
    setupAuth(context, username, password, token, ha1);
    return context;
}

export function createClient(remoteURL: string, options: WebDAVClientOptions = {}) {
    const context = createContext(remoteURL, options);
    return new WebDAVClient(context);
    // return {
    //     copyFile: (filename: string, destination: string, options?: WebDAVMethodOptions) => copyFile(context, filename, destination, options),
    //     createDirectory: (path: string, options?: WebDAVMethodOptions) => createDirectory(context, path, options),
    //     // createReadStream: (filename: string, options?: CreateReadStreamOptions) => createReadStream(context, filename, options),
    //     // createWriteStream: (filename: string, options?: CreateWriteStreamOptions, callback?: CreateWriteStreamCallback) => createWriteStream(context, filename, options, callback),
    //     customRequest: (path: string, requestOptions: RequestOptions) => customRequest(context, path, requestOptions),
    //     deleteFile: (filename: string, options?: WebDAVMethodOptions) => deleteFile(context, filename, options),
    //     exists: (path: string, options?: WebDAVMethodOptions) => exists(context, path, options),
    //     getDirectoryContents: async (remotePath: string, options: GetDirectoryContentsOptions = {}) => {
    //         const requestOptions = prepareRequestOptions(
    //             {
    //                 url: joinURL(context.remoteURL, encodePath(remotePath), SEPARATOR),
    //                 method: 'PROPFIND' as any,
    //                 headers: {
    //                     Accept: 'text/plain,application/xml',
    //                     Depth: !!options.deep ? 'infinity' : '1'
    //                 }
    //             },
    //             context,
    //             options
    //         );
    //         const response = await request(requestOptions);
    //         await handleResponseCode(context, response);
    //         const responseData = await response.content.toStringAsync();
    //         if (!responseData) {
    //             throw new Error('Failed parsing directory contents: Empty response');
    //         }
    //         const davResp = await parseXML(responseData);
    //         const _remotePath = makePathAbsolute(remotePath);
    //         const remoteBasePath = context.remoteBasePath || context.remotePath;
    //         const files = getDirectoryFiles(davResp, remoteBasePath, _remotePath, options.details, options.includeSelf);
    //         // if (options.glob) {
    //         //     files = processGlobFilter(files, options.glob);
    //         // }
    //         return processResponsePayload(response, files, options.details);
    //     },
    //     getFileContents: (filename: string, options?: GetFileContentsOptions) => getFileContents(context, filename, options),
    //     getFileDownloadLink: (filename: string) => getFileDownloadLink(context, filename),
    //     getFileUploadLink: (filename: string) => getFileUploadLink(context, filename),
    //     getHeaders: () => Object.assign({}, context.headers),
    //     getQuota: (options?: GetQuotaOptions) => getQuota(context, options),
    //     lock: (path: string, options?: LockOptions) => lock(context, path, options),
    //     moveFile: (filename: string, destinationFilename: string, options?: WebDAVMethodOptions) => moveFile(context, filename, destinationFilename, options),
    //     putFileContents: (filename: string, data: string | BufferLike /*  | Stream.Readable */, options?: PutFileContentsOptions) => putFileContents(context, filename, data, options),
    //     search: (path: string, options?: SearchOptions) => getSearch(context, path, options),
    //     setHeaders: (headers: Headers) => {
    //         context.headers = Object.assign({}, headers);
    //     },
    //     stat: (path: string, options?: StatOptions) => getStat(context, path, options),
    //     unlock: (path: string, token: string, options?: WebDAVMethodOptions) => unlock(context, path, token, options)
    // };
}
