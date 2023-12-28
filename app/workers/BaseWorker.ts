export type WorkerEventType = 'getResource' | 'event' | 'playSound' | 'stopSound';

export interface WorkerPostOptions {
    id?: number;
    messageData?: string;
}

export type WorkerPostEvent = { type: string } & WorkerPostOptions;

export interface WorkerResult {}

export interface IWorker extends BaseWorker {
    onmessage: Function;
    postMessage(event: WorkerPostEvent);
}
const TAG = '[BaseWorker]';

export default abstract class BaseWorker {
    constructor(protected context) {}
    onmessage: Function;
    // postMessage: (event: WorkerPostEvent) => void; //official worker method

    receivedMessage(event: { data }) {
        const data = event.data;
        const id = data.id;
        if (data.type === 'terminate') {
            this.context.close();
            return true;
        }

        // if (id && this.messagePromises.hasOwnProperty(id)) {
        //     this.messagePromises[id].forEach(function (executor) {
        //         executor.timeoutTimer && clearTimeout(executor.timeoutTimer);
        //         executor.resolve(data.messageData);
        //     });
        //     delete this.messagePromises[id];
        //     return true;
        // }
        return false;
    }

    // messagePromises: { [key: string]: { resolve: Function; reject: Function; timeoutTimer: number }[] } = {};
    // postPromiseMessage<T = any>(type: string, messageData, id = 0, timeout = 0, nativeData?): Promise<T> {
    //     return new Promise((resolve, reject) => {
    //         const id = Date.now().valueOf();
    //         if (id || timeout) {
    //             this.messagePromises[id] = this.messagePromises[id] || [];
    //             let timeoutTimer;
    //             if (timeout > 0) {
    //                 timeoutTimer = setTimeout(() => {
    //                     // we need to try catch because the simple fact of creating a new Error actually throws.
    //                     // so we will get an uncaughtException
    //                     try {
    //                         reject(new Error('timeout'));
    //                     } catch {}
    //                     delete this.messagePromises[id];
    //                 }, timeout);
    //             }
    //             this.messagePromises[id].push({ reject, resolve, timeoutTimer });
    //         }

    //         // const result = worker.processImage(image, { width, height, rotation });
    //         // handleContours(result.contours, rotation, width, height);
    //         // const keys = Object.keys(nativeData);
    //         // if (__ANDROID__) {
    //         //     keys.forEach((k) => {
    //         //         com.akylas.documentscanner.WorkersContext.setValue(`${id}_${k}`, nativeData[k]._native || nativeData[k]);
    //         //     });
    //         // }
    //         const mData = {
    //             id,
    //             // nativeDataKeys: keys,
    //             messageData: JSON.stringify(messageData),
    //             type
    //         };
    //         DEV_LOG && console.log(TAG, 'postMessage', mData, this.messagePromises[id]);
    //         (global as any).postMessage(mData);
    //     });
    // }
}
