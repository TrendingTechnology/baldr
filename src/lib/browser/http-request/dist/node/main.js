"use strict";
/**
 * A wrapper around Axios. This module bundles the configuration and selects the
 * right configuration according to the Browsers global `location` object.
 * It tries to simplify the request API of Axios.
 *
 * @see {@link https://github.com/axios/axios}
 *
 * @module @bldr/http-request
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReachability = exports.makeHttpRequestInstance = exports.HttpRequest = void 0;
/* globals location */
const axios_1 = require("axios");
// Do not remove this lines. The comments are removed by the build script.
 const { JSDOM } = require('jsdom')
 const { window } = new JSDOM('', { url: 'http://localhost' })
 const location = window.location
/**
 * A wrapper around Axios.
 */
class HttpRequest {
    /**
     * Make an configured instance of the `HttpRequest()` class.
     *
     * @param config - The parsed configuration file `/etc/baldr.json`.
     * @param restEndPoint - Possible values are `local`, `remote` and `automatic`.
     *   The value `automatic` needs the global object `location`.
     * @param urlFillIn - A URL segment that is inserted between the base
     *   URL and the last part of  the URL. For example
     *
     *   - `baseUrl`: `localhost`
     *   - `urlFillIn`: `/api/media`
     *   - `url`: `query`
     *
     *   results in the URL `http://localhost/api/media/query`.
     */
    constructor(config, restEndPoint, urlFillIn) {
        this.urlFillIn = urlFillIn;
        let isRemote = false;
        // Electron (build version): location.hostname: '.'
        // Electron (build version): location.protocol: 'app'
        if (restEndPoint === 'remote' ||
            (restEndPoint === 'automatic' &&
                location != null &&
                location.hostname !== 'localhost' &&
                location.hostname !== '.')) {
            isRemote = true;
        }
        if (!isRemote) {
            this.baseUrl = `http://${config.http.domainLocal}`;
        }
        else {
            this.baseUrl = `https://${config.http.domainRemote}`;
        }
        const axiosConfig = {
            baseURL: this.baseUrl,
            timeout: 10000
        };
        if (isRemote) {
            axiosConfig.auth = {
                username: config.http.username,
                password: config.http.password
            };
        }
        this.axiosInstance = axios_1.default.create(axiosConfig);
    }
    /**
     * Format the URL.
     *
     * - `query`: `http://localhost/api/media/query`
     * - `/query`: `http://localhost/query`
     * - `http://example.com`: `http://example.com`
     *
     * @property url - A path relative to the REST endpoints base URL or a HTTP
     *   URL. If `url` starts with `/` the `urlFillin` is not used.
     */
    formatUrl(url) {
        if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
            return url;
        }
        if (this.urlFillIn != null && url.substr(0, 1) !== '/') {
            return `${this.urlFillIn}/${url}`;
        }
        return url;
    }
    /**
     * Wrapper around `axios.request(config)`.
     *
     * @see {@link https://github.com/axios/axios#axiosrequestconfig}
     *
     * @param requestConfig - An important property is `url`: A path relative to the REST
     *   endpoints’ base URL. If `url` starts with `/` the `urlFillin` is not
     *   used.
     *
     * <pre><code>
     * {
     *   method: 'get',
     *   url: 'data/entry'
     * }
     * </code></pre>
     *
     * <pre><code>
     * {
     * url: 'query',
     * params: {
     *   type: 'assets',
     *   field: 'ref',
     *   method: 'exactMatch',
     *   search: 'IN_Cembalo'
     * }
     * </code></pre>
     */
    request(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof requestConfig === 'string') {
                requestConfig = { method: 'get', url: requestConfig };
            }
            if (!('method' in requestConfig)) {
                requestConfig.method = 'get';
            }
            if (requestConfig.url !== null && typeof requestConfig.url === 'string') {
                requestConfig.url = this.formatUrl(requestConfig.url);
            }
            return yield this.axiosInstance.request(requestConfig);
        });
    }
}
exports.HttpRequest = HttpRequest;
/**
 * Make an configured instance of the `HttpRequest()` class.
 *
 * @param config: The parsed configuration file `/etc/baldr.json`.
 * @param restEndPoint: Possible values are `local`, `remote` and `automatic`.
 *   The value `automatic` needs the global object `location`.
 * @param urlFillIn - A URL segment that is inserted between the base
 *   URL and the last part of  the URL. For example
 *
 *   - `baseUrl`: `localhost`
 *   - `urlFillIn`: `/api/media`
 *   - `url`: `query`
 *
 *   results in the URL `http://localhost/api/media/query`.
 *
 * @returns A instance of the class `HttpRequest()`.
 */
function makeHttpRequestInstance(config, restEndPoint, urlFillIn) {
    return new HttpRequest(config, restEndPoint, urlFillIn);
}
exports.makeHttpRequestInstance = makeHttpRequestInstance;
/**
 * Check if a URL is reachable.
 *
 * @param url - A fully qualified HTTP URL
 *
 * @returns True if the URL is reachable, false else.
 */
function checkReachability(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield axios_1.default.get(url);
        }
        catch (error) {
            return false;
        }
        return true;
    });
}
exports.checkReachability = checkReachability;
// export function get (url: string, requestConfig?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
//   return axios.get(url, requestConfig)
// }
