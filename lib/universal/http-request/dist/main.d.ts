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
import { Configuration } from '@bldr/config';
export { AxiosRequestConfig } from 'axios';
declare type RestEndPoint = 'local' | 'remote' | 'automatic';
/**
 * A wrapper around Axios.
 */
export declare class HttpRequest {
    /**
     * A URL segment that is inserted between the base URL and the last part of
     * the URL. For example
     *
     * - `baseUrl`: `localhost`
     * - `urlFillIn`: `/api/media`
     * - `url`: `query`
     *
     * results in the URL `http://localhost/api/media/query`.
     */
    private readonly urlFillIn?;
    /**
     * The base URL of the REST endpoint, for example `http://localhost` or
     * `https://baldr.example.com`.
     */
    readonly baseUrl: string;
    /**
     * An Axios instance.
     *
     * @see {@link https://github.com/axios/axios#axioscreateconfig}
     */
    private readonly axiosInstance;
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
    constructor(config: Configuration, restEndPoint: RestEndPoint, urlFillIn?: string);
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
    private formatUrl;
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
    request(requestConfig: string | AxiosRequestConfig): Promise<AxiosResponse<any>>;
}
/**
 * A wrapper function around `axios.get()`
 */
export declare function getHttp(url: string, requestConfig?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
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
export declare function makeHttpRequestInstance(config: Configuration, restEndPoint: RestEndPoint, urlFillIn: string): HttpRequest;
/**
 * Check if a URL is reachable.
 *
 * @param url - A fully qualified HTTP URL
 *
 * @returns True if the URL is reachable, false else.
 */
export declare function checkReachability(url: string): Promise<boolean>;
