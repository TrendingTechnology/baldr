/**
 * A wrapper around Axios. This module bundles the configuration and selects the
 * right configuration according to the Browsers global `location` object.
 * It tries to simplify the request API of Axios.
 *
 * @see {@link https://github.com/axios/axios}
 *
 * @module @bldr/http-request
 */
/* globals config location */
import axios from 'axios';
const restEndPoints = {
    local: {
        domain: config.http.domainLocal
    },
    remote: {
        domain: config.http.domainRemote,
        auth: {
            username: config.http.username,
            password: config.http.password
        }
    }
};
/**
 * A wrapper around Axios.
 */
export class HttpRequest {
    /**
     * @param urlFillIn - A URL segment that is inserted between the base
     * URL and the last part of  the URL. For example
     *
     * - `baseUrl`: `localhost`
     * - `urlFillIn`: `/api/media`
     * - `url`: `query`
     *
     * results in the URL `http://localhost/api/media/query`.
     *
     * @param remote - Connect to a remote REST endpoint.
     */
    constructor(urlFillIn, remote = false) {
        /**
         * A URL segment that is inserted between the base URL and the last part of
         * the URL. For example
         *
         * - `baseUrl`: `localhost`
         * - `urlFillIn`: `/api/media`
         * - `url`: `query`
         *
         * results in the URL `http://localhost/api/media/query`.
         *
         * @type {String}
         */
        this.urlFillIn = urlFillIn;
        /**
         * The base URL of the REST endpoint.
         *
         * @type {String}
         */
        this.baseUrl = null;
        // Electron (build version): location.hostname: '.'
        if ((location.hostname === 'localhost' || location.hostname === '.') && !remote) {
            // Electron (build version): location.protocol: 'app'
            this.baseUrl = `http://${restEndPoints.local.domain}`;
        }
        else {
            this.baseUrl = `https://${restEndPoints.remote.domain}`;
        }
        const axiosConfig = {
            baseURL: this.baseUrl,
            timeout: 10000
        };
        if (remote) {
            axiosConfig.auth = restEndPoints.remote.auth;
        }
        /**
         * An Axios instance.
         *
         * @see {@link https://github.com/axios/axios#axioscreateconfig}
         *
         * @type {Object}
         */
        this.axiosInstance_ = axios.create(axiosConfig);
    }
    /**
     * @property url - A path relative to REST endpoints base URL. if
     *   `url` starts with `/` the `urlFillin` is not used.
     */
    formatUrl_(url) {
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
     * @param config - An important property is `url`: A path relative to the REST
     *   endpoints’ base URL. If `url` starts with `/` the `urlFillin` is not
     *   used.
     */
    request(config) {
        if (typeof config === 'string') {
            config = { method: 'get', url: config };
        }
        if (!('method' in config)) {
            config.method = 'get';
        }
        if (config.url)
            config.url = this.formatUrl_(config.url);
        return this.axiosInstance_.request(config);
    }
}
