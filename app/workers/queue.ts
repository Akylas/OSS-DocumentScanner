import { Observable } from '@nativescript/core';

export default class Queue extends Observable {
    private workingOnPromise = false;
    private queue = [];
    private  pendingPromise = false;
    add(promise) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promise,
                resolve,
                reject
            });
            this.dequeue();
        });
    }

    dequeue() {
        if (this.workingOnPromise) {
            return false;
        }
        const item = this.queue.shift();
        if (!item) {
            this.notify({ eventName: 'done' });
            return false;
        }
        try {
            this.workingOnPromise = true;
            item.promise()
                .then((value) => {
                    this.workingOnPromise = false;
                    item.resolve(value);
                    this.dequeue();
                })
                .catch((err) => {
                    this.workingOnPromise = false;
                    item.reject(err);
                    this.dequeue();
                });
        } catch (err) {
            this.workingOnPromise = false;
            item.reject(err);
            this.dequeue();
        }
        return true;
    }
}
