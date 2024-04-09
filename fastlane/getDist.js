const nsWebpack = require('@akylas/nativescript-webpack');
const { resolve } = require('path');
const projectRoot = resolve('./')
const platform = process.argv[2]
const dist = resolve(projectRoot, nsWebpack.getAppPath(platform, projectRoot));
console.log(dist);