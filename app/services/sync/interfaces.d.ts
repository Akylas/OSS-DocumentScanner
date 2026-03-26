import { Headers } from '@nativescript-community/https';

export type BufferLike = Buffer | ArrayBuffer;
export type ResponseData<V extends 'binary' | 'text' | 'json' | 'file' = 'json', W = any> = V extends 'file' ? File : V extends 'text' ? string : V extends 'json' ? W : BufferLike;
export interface ResponseDataDetailed<T> {
    data: T;
    headers: Headers;
    status: number;
    statusText: string;
}
export type ResponseData = string | Buffer | ArrayBuffer | object | any[];
export type Response<T = any> = HttpsResponse<HttpsResponseLegacy<T>>;
