import '@nativescript/core/globals';
(async () => {
    try {
        // we use that trick to catch errors in top level app imports
        await import('./SyncWorker');
    } catch (error) {
        console.error('error', error, error.stack);
    }
})();
