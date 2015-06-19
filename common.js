/**
 * @author VovanR <mail@vovanr.com>
 */

if (!requirejs.config.baseUrl) {
    requirejs.config.baseUrl = '../js/';
}

requirejs.config({
    baseUrl: requirejs.config.baseUrl,
    paths: {
        jquery: '../node_modules/jquery/dist/jquery',
        chai: '../node_modules/chai/chai',
        sinon: '../node_modules/sinon/pkg/sinon',
        lodash: '../node_modules/lodash/index',
    },
});
