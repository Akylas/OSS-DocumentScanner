// IgnoreNotFoundExportPlugin.js
const ModuleDependencyWarning = require('webpack/lib/ModuleDependencyWarning');

// ↓ Based on https://github.com/sindresorhus/escape-string-regexp
const escapeStringForRegExp = (string) => string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');

module.exports = class IgnoreNotFoundExportPlugin {
    constructor(exportsToIgnore) {
        this.exportsToIgnore = exportsToIgnore || [];
    }

    getMessageRegExp() {
        if (this.exportsToIgnore.length > 0) {
            const exportsPattern = '(' + this.exportsToIgnore.map(escapeStringForRegExp).join('|') + ')';

            return new RegExp(`export '${exportsPattern}'( \\((imported|reexported) as '.*'\\))? was not found in`);
        } else {
            return /export '.*'( \((imported|reexported) as '.*'\))? was not found in/;
        }
    }

    apply(compiler) {
        const messageRegExp = this.getMessageRegExp();

        const afterCompile = (compilation) => {
            const stats = compilation.getStats();
            stats.compilation.warnings = stats.compilation.warnings.filter((warn) => {
                if (warn instanceof ModuleDependencyWarning && messageRegExp.test(warn.message)) {
                    return false;
                }
                return true;
            });
        };

        if (compiler.hooks) {
            compiler.hooks.afterCompile.tap('IgnoreNotFoundExportPlugin', afterCompile);
        } else {
            console.warn('webpack compiler-hooks not supported!');
            // compiler.plugin('done', doneHook);
        }
    }
};
