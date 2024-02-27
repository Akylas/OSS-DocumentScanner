import type { TraceErrorHandler } from '@nativescript/core';

let _errorHandler: TraceErrorHandler;
export namespace Trace {
    export function isEnabled() {
        return false;
    }
    export function write() {}
    export const categories = {};
    export const messageType = {};

    export function getErrorHandler(): TraceErrorHandler {
        return _errorHandler;
    }

    export function setErrorHandler(handler: TraceErrorHandler) {
        _errorHandler = handler;
    }

    /**
     * Passes an error to the registered ErrorHandler
     * @param error The error to be handled.
     */
    export function error(error: string | Error) {
        if (!_errorHandler) {
            return;
        }

        if (typeof error === 'string') {
            error = new Error(error);
        }

        _errorHandler.handlerError(error);
    }
}
