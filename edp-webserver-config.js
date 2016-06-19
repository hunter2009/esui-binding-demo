/**
 * @file config edp-webserver
 * @author EFE
 */

/* globals home, redirect, content, empty, autocss, file, less, stylus, proxyNoneExists */

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var babelCore = require('babel-core');

exports.getLocations = function () {
    return [
        {
            location: /\.css($|\?)/,
            handler: [
                autocss()
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /^\/src\/external\//,
            handler: [
                file()
            ]
        },
        {
            location: /^\/(src|dep)\/.*(\.js|\.js\.map)($|\?)/,
            handler: [
                babel({sourceMaps: 'inline'}, {babel: babelCore})
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

/* eslint-disable guard-for-in */
exports.injectResource = function (res) {
    for (var key in res) {
        global[key] = res[key];
    }
};
