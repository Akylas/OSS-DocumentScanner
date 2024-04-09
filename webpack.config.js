const webpack = require('@akylas/nativescript-webpack');
module.exports = (env) => {
    webpack.init(env);
    return webpack.resolveConfig();
};
