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
exports.makeHttpRequestInstance = void 0;
/* globals location */
const axios_1 = require("axios");
/**
 * A wrapper around Axios.
 */
class HttpRequest {
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
     */
    constructor(config, restEndPoint, urlFillIn) {
        this.urlFillIn = urlFillIn;
        let isRemote = false;
        // Electron (build version): location.hostname: '.'
        // Electron (build version): location.protocol: 'app'
        if (restEndPoint === 'remote' || (restEndPoint === 'automatic' && (location.hostname !== 'localhost' && location.hostname !== '.'))) {
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
     * @property url - A path relative to REST endpoints base URL. if
     *   `url` starts with `/` the `urlFillin` is not used.
     */
    formatUrl(url) {
        if (this.urlFillIn && url.substr(0, 1) !== '/') {
            return `${this.urlFillIn}/${url}`;
        }
        return url;
    }
    /**
     * Wrapper around `axios.request(config)`.
     *
     * @see {@link https://github.com/axios/axios#axiosrequestconfig}
     *
     * <pre><code>
     * {
     *   method: 'get',
     *   url: 'data/entry'
     * }
     * </code></pre>
     *
     * @param requestConfig - An important property is `url`: A path relative to the REST
     *   endpoints’ base URL. If `url` starts with `/` the `urlFillin` is not
     *   used.
     */
    request(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof requestConfig === 'string') {
                requestConfig = { method: 'get', url: requestConfig };
            }
            if (!('method' in requestConfig)) {
                requestConfig.method = 'get';
            }
            if (requestConfig.url) {
                requestConfig.url = this.formatUrl(requestConfig.url);
            }
            return yield this.axiosInstance.request(requestConfig);
        });
    }
}
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
