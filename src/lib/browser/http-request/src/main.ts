/**
 * A wrapper around Axios. This module bundles the configuration and selects the
 * right configuration according to the Browsers global `location` object.
 * It tries to simplify the request API of Axios.
 *
 * @see {@link https://github.com/axios/axios}
 *
 * @module @bldr/http-request
 */

/* globals location */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import { Configuration } from '@bldr/type-definitions'

type RestEndPoint = 'local' | 'remote' | 'automatic'

/**
 * A wrapper around Axios.
 */
export class HttpRequest {
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
  private readonly urlFillIn?: string

  /**
   * The base URL of the REST endpoint.
   */
  public readonly baseUrl: string

  /**
   * An Axios instance.
   *
   * @see {@link https://github.com/axios/axios#axioscreateconfig}
   */
  private readonly axiosInstance: AxiosInstance

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
  constructor (config: Configuration, restEndPoint: RestEndPoint, urlFillIn?: string) {
    this.urlFillIn = urlFillIn

    let isRemote: boolean = false

    // Electron (build version): location.hostname: '.'
    // Electron (build version): location.protocol: 'app'
    if (restEndPoint === 'remote' || (restEndPoint === 'automatic' && (location.hostname !== 'localhost' && location.hostname !== '.'))) {
      isRemote = true
    }

    if (!isRemote) {
      this.baseUrl = `http://${config.http.domainLocal}`
    } else {
      this.baseUrl = `https://${config.http.domainRemote}`
    }

    const axiosConfig: AxiosRequestConfig = {
      baseURL: this.baseUrl,
      timeout: 10000
    }

    if (isRemote) {
      axiosConfig.auth = {
        username: config.http.username,
        password: config.http.password
      }
    }

    this.axiosInstance = axios.create(axiosConfig)
  }

  /**
   * @property url - A path relative to REST endpoints base URL. if
   *   `url` starts with `/` the `urlFillin` is not used.
   */
  private formatUrl (url: string): string {
    if (this.urlFillIn !== null && typeof this.urlFillIn === 'string' && url.substr(0, 1) !== '/') {
      return `${this.urlFillIn}/${url}`
    }
    return url
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
   *   field: 'id',
   *   method: 'exactMatch',
   *   search: 'IN_Cembalo'
   * }
   * </code></pre>
   */
  async request (requestConfig: string | AxiosRequestConfig): Promise<AxiosResponse<any>> {
    if (typeof requestConfig === 'string') {
      requestConfig = { method: 'get', url: requestConfig }
    }
    if (!('method' in requestConfig)) {
      requestConfig.method = 'get'
    }
    if (requestConfig.url !== null && typeof requestConfig.url === 'string') {
      requestConfig.url = this.formatUrl(requestConfig.url)
    }
    return await this.axiosInstance.request(requestConfig)
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
export function makeHttpRequestInstance (config: Configuration, restEndPoint: RestEndPoint, urlFillIn: string): HttpRequest {
  return new HttpRequest(config, restEndPoint, urlFillIn)
}
