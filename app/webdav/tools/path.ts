import { SEPARATOR } from '~/utils/constants';

const SEP_PATH_POSIX = '__PATH_SEPARATOR_POSIX__';
const SEP_PATH_WINDOWS = '__PATH_SEPARATOR_WINDOWS__';

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
const posix = {};

function posixSplitPath(filename) {
    return splitPathRe.exec(filename).slice(1);
}

export function dirname(path) {
    const result = posixSplitPath(path),
        root = result[0];
    let dir = result[1];

    if (!root && !dir) {
        // No dirname whatsoever
        return '.';
    }

    if (dir) {
        // It has a dirname, strip trailing slash
        dir = dir.substring(0, dir.length - 1);
    }

    return root + dir;
}

export function basename(path, ext?) {
    let f = posixSplitPath(path)[2];
    // TODO: make this comparison case-insensitive on windows?
    if (ext && f.substring(-1 * ext.length) === ext) {
        f = f.substring(0, f.length - ext.length);
    }
    return f;
}

export function extname(path) {
    return posixSplitPath(path)[3];
}

export function encodePath(filePath: string): string {
    try {
        const replaced = filePath.replace(/\//g, SEP_PATH_POSIX).replace(/\\\\/g, SEP_PATH_WINDOWS);
        const formatted = encodeURIComponent(replaced);
        return formatted.split(SEP_PATH_WINDOWS).join('\\\\').split(SEP_PATH_POSIX).join(SEPARATOR);
    } catch (err) {
        throw err;
    }
}

export function getAllDirectories(directory: string): string[] {
    DEV_LOG && console.log('getAllDirectories', directory);
    if (!directory || directory === SEPARATOR) return [];
    let currentPath = directory;
    const output: string[] = [];
    do {
        output.push(currentPath);
        currentPath = dirname(currentPath);
    } while (currentPath && currentPath !== SEPARATOR);
    return output;
}

export function makePathAbsolute(pathStr: string): string {
    return pathStr.startsWith(SEPARATOR) ? pathStr : SEPARATOR + pathStr;
}

export function normalisePath(normalisedPath: string): string {
    // let normalisedPath = makePathAbsolute(pathStr);
    if (/^.+\/$/.test(normalisedPath)) {
        normalisedPath = normalisedPath.substring(0, normalisedPath.length - 1);
    }
    return normalisedPath;
}
