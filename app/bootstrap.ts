(async () => {
    try {
        // we use that trick to catch errors in top level app imports
        await import('./app');
    } catch (error) {
        console.error('error', error, error.stack);
    }
})();
