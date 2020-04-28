/**
 * A wrapper around axios. Bundles configuration, selects the right
 * configuration according `window.location`. Simplfy request api.
 *
 * @module @bldr/http-request
 */

/* globals config location */

import axios from 'axios'

const defaultServers = {
  local: {
    baseURL: config.http.domainLocal,
    https: false,
    checkUrl: 'version'
  },
  remote: {
    baseURL: config.http.domainRemote,
    https: true,
    checkUrl: 'version',
    auth: {
      username: config.http.username,
      password: config.http.password
    }
  }
}

function deepClone (object) {
  // We change the object so we need a deep clone.
  return JSON.parse(JSON.stringify(object))
}

export function getDefaultServers () {
  return deepClone(defaultServers)
}

/**
 * @param {object} servers - A object represention multiple servers.
 * @param {string} urlFillIn - A string which gets filled between the base URL
 *   and the last part of the URL.
 */
export class HttpRequest {
  constructor (servers, urlFillIn) {
    this.urlFillIn = urlFillIn
    this.defaultConfig = {
      timeout: 10000,
      crossDomain: true
    }

    this.servers = {}
    for (const name in servers) {
      if (location.protocol === 'http:' || (location.protocol === 'https:' && servers[name].https)) {
        this.servers[name] = Object.assign(servers[name], this.defaultConfig)

        let httpString
        if (this.servers[name].https) {
          httpString = 'https://'
        } else {
          httpString = 'http://'
        }
        delete this.servers[name].https
        this.servers[name].baseURL = `${httpString}${this.servers[name].baseURL}`
      }
    }

    /**
     * An array of Axios instances
     * @type {array}
     */
    this.axiosInstances_ = []

    this.serverList_ = []
  }

  /**
   * Reset the Axios instance to get a new instance. To check different
   * URL.
   *
   * @private
   */
  resetAxiosInstances_ () {
    this.axiosInstances_ = []
    this.serverList_ = []
  }

  formatUrl (url) {
    if (this.urlFillIn && url.substr(0, 1) !== '/') {
      return `${this.urlFillIn}/${url}`
    }
    return url
  }

  initalised () {
    return this.axiosInstances_.length > 0
  }

  /**
   * @private
   */
  async createAxiosInstances_ () {
    if (this.initalised()) {
      return
    }
    for (const name in this.servers) {
      const conn = this.servers[name]
      try {
        const axiosInstance = axios.create(conn)
        await axiosInstance.get(this.formatUrl(conn.checkUrl))
        this.axiosInstances_.push(axiosInstance)
        this.serverList_.push(name)
      } catch (error) {}
    }
  }

  async getFirstBaseUrl () {
    await this.createAxiosInstances_()
    if (this.initalised()) return this.axiosInstances_[0].defaults.baseURL
  }

  async getServers () {
    await this.createAxiosInstances_()
    const servers = []
    for (const axiosInstance of this.axiosInstances_) {
      servers.push(axiosInstance.defaults)
    }
    return servers
  }

  async axiosRequest (config, requestAllServer = false) {
    config.url = this.formatUrl(config.url)
    if (requestAllServer) {
      const results = []
      for (const instance of this.axiosInstances_) {
        results.push(await instance.request(config))
      }
      return results
    } else {
      return this.axiosInstances_[0].request(config)
    }
  }

  /**
   * Wrapper around axios.request. See axios.request
   *
   * <pre><code>
   * {
   *   method: 'get',
   *   url: 'data/entry'
   * }
   * </code></pre>
   *
   * @param {object} config
   */
  async request (config, requestAllServer = false) {
    if (typeof config === 'string') {
      config = { method: 'get', url: config }
    }
    if (!('method' in config)) {
      config.method = 'get'
    }
    try {
      if (!this.initalised()) await this.createAxiosInstances_()
      return this.axiosRequest(config, requestAllServer)
    } catch (error) {
      this.resetAxiosInstances_()
      await this.createAxiosInstances_()
      return this.axiosRequest(config, requestAllServer)
    }
  }
}

export default new HttpRequest(getDefaultServers())
