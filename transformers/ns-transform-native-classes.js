"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
function default_1(ctx) {
    function isNativeClassExtension(node) {
        return node.decorators && node.decorators.filter((d) => d.getFullText().trim().indexOf('@NativeClass') === 0).length > 0;
    }
    function visitNode(node) {
        if (ts.isClassDeclaration(node) && isNativeClassExtension(node)) {
            return createHelper(node);
        }
        return ts.visitEachChild(node, visitNode, ctx);
    }
    function createHelper(node) {
        // we remove the decorator for now!
        return ts.createIdentifier(ts.transpileModule(node.getText().replace(/@NativeClass(\((.|\n)*?\))?/gm, ''), {
            compilerOptions: { noEmitHelpers: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5 },
        }).outputText);
    }
    return (source) => ts.updateSourceFileNode(source, ts.visitNodes(source.statements, visitNode));
}
exports.default = default_1;
//# sourceMappingURL=ns-transform-native-classes.js.map