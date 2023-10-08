const mergeOptions = require('./node_modules/merge-options');
module.exports = mergeOptions(require('./nativescript.config'), {
    forceLog: true,
    android: {
        maxLogcatObjectSize: 14096,
        forceLog: true
    }
});
