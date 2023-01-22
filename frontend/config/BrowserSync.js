import path from "path";
import browserSync from "browser-sync";
import {createProxyMiddleware} from "http-proxy-middleware";
import {responseInterceptor} from "http-proxy-middleware";

export default class {
    constructor(parent) {
        this.parent = parent;
        this.proxyMiddleware = createProxyMiddleware;
        this.responseInterceptor = responseInterceptor;

        this.port = parseInt(process.env.VIRTUAL_PORT);

        this.proxyPort = parseInt(process.env.PROXY_TARGET_PORT);
        this.proxyHost = process.env.VIRTUAL_HOST;

        this.engine = browserSync.create();

        this.proxy = this.proxyMiddleware({

            // internal docker hostname
            target: `http://weather-station.servant`,
            changeOrigin: true,
            secure: false,
            rejectUnauthorized: false,
            //selfHandleResponse: true,
            /*onProxyRes: this.responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
                // replace location header
                //--//proxyRes.headers.location ? res.setHeader('location', proxyRes.headers.location.replace(new RegExp(/\/seiffen.servant/, 'g'), '/frontend.seiffen.servant')) : false;

                // rewrite response html plain and json
                let response = responseBuffer.toString('utf8');
                const matchHtml = new RegExp(/text/);
                const matchJson = new RegExp(/json/);
                if (matchHtml.test(proxyRes.headers['content-type']) || matchJson.test(proxyRes.headers['content-type'])) {
                    response = response.replace(new RegExp(/https:/, 'g'), 'http:/');
                    //--//response = response.replace(new RegExp(/\/seiffen.servant/, 'g'), '/frontend.seiffen.servant');
                    return response;
                } else {
                    return responseBuffer;
                }
            }),*/
            /*onProxyReq: (proxyReq, req, res, options) => {
                // suppress shopware's redirect
                // the 'Host' equals the value from database: s_core_shops.host
                //--//proxyReq.setHeader('Host', 'seiffen.servant');
            }*/
        });

        this.bundePath = path.resolve(`${process.cwd()}/dist/dev`);

        console.log('>>> BUNDLE PATH:', this.bundePath);

        this.engine.init({
            watch: true,
            cwd: `${this.bundePath}/css/`,
            injectChanges: true,
            files: ["*.css"],
            port: this.port,
            open: false,
            reloadDebounce: 50,
            server: {
                middleware: [this.proxy]
            }
            /*proxy: {
                target: `app:${this.proxyPort}`,
                ws: true
            }*/
        });

        console.log(Object.keys(this.engine));


    }
}


/*
const browserSync = require('browser-sync').create();
const path = require('path');
//
// rewrite text/plain responses
//
const proxy = proxyMiddleware({
    // internal docker hostname
    target: 'http://seiffen-shopware',
    changeOrigin: true,
    secure: false,
    rejectUnauthorized: false,
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        // replace location header
        proxyRes.headers.location ? res.setHeader('location', proxyRes.headers.location.replace(new RegExp(/\/seiffen.servant/, 'g'), '/frontend.seiffen.servant')) : false;

        // rewrite response html plain and json
        let response = responseBuffer.toString('utf8');
        const matchHtml = new RegExp(/text/);
        const matchJson = new RegExp(/json/);
        if (matchHtml.test(proxyRes.headers['content-type']) || matchJson.test(proxyRes.headers['content-type'])) {
            response = response.replace(new RegExp(/https:/, 'g'), 'http:/');
            response = response.replace(new RegExp(/\/seiffen.servant/, 'g'), '/frontend.seiffen.servant');
            return response;
        } else {
            return responseBuffer;
        }
    }),
    onProxyReq: (proxyReq, req, res, options) => {
        // suppress shopware's redirect
        // the 'Host' equals the value from database: s_core_shops.host
        proxyReq.setHeader('Host', 'seiffen.servant');
    }
});

module.exports = grunt => {
    grunt.registerTask('browsersync', function () {
        browserSync.init({
            watch: true,
            cwd: path.resolve(process.cwd() + relativeShopwarePath + '/web/cache/'),
            injectChanges: true,
            files: ["*.css"],
            port: 80,
            open: false,
            host: 'frontend.seiffen.servant',
            reloadDebounce: 250,
            server: {
                middleware: [proxy]
            }
        });
    });
}
*/
