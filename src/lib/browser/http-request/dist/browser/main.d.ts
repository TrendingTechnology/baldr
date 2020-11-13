/**
 * A wrapper around Axios. This module bundles the configuration and selects the
 * right configuration according to the Browsers global `location` object.
 * It tries to simplify the request API of Axios.
 *
 * @see {@link https://github.com/axios/axios}
 *
 * @module @bldr/http-request
 */
import { AxiosRequestConfig, AxiosResponse } from 'axios';
/**
 * A wrapper around Axios.
 */
export declare class HttpRequest {
    urlFillIn: string;
    baseUrl: string | null;
    private axiosInstance_;
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
    constructor(urlFillIn: string, remote?: boolean);
    /**
     * @property url - A path relative to REST endpoints base URL. if
     *   `url` starts with `/` the `urlFillin` is not used.
     */
    private formatUrl_;
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
    request(config: string | AxiosRequestConfig): Promise<AxiosResponse<any>>;
}
