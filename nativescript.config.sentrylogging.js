const mergeOptions = require('./node_modules/merge-options');
module.exports = mergeOptions(require('./nativescript.config.logging'), {
    ignoredNativeDependencies: []
});
