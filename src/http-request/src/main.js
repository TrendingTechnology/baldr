/**
 * @file Make HTTP requests on multiple servers, for example on a local and a
 *   remote HTTP server.
 * @module @bldr/http-request
 */

/* globals config location */

import axios from 'axios'

class RestEndpoint {
  constructor ({ name, domain, https, checkPath, auth }) {
    let httpScheme
    if (https) {
      httpScheme = 'https://'
    } else {
      httpScheme = 'http://'
    }
    this.baseUrl = `${httpScheme}${domain}`
    this.name = name
    this.domain = domain
    this.checkPath = checkPath
    this.auth = auth
    this.axiosInstance_ = null
    this.checked_ = false
  }

  getAxiosConfig () {
    const config = {
      timeout: 10000,
      crossDomain: true,
      baseURL: this.baseUrl
    }
    if (this.auth) {
      config.auth = this.auth
    }
    return config
  }

  async checkReachability () {
    if (!this.checked_) {
      try {
        const axiosInstance = axios.create(this.getAxiosConfig())
        await axiosInstance.get(this.checkPath)
        this.axiosInstance_ = axiosInstance
        this.checked_ = true
      } catch (error) {
        this.axiosInstance_ = null
      }
      return true
    }
  }

  get isReachable () {
    if (this.axiosInstance_) {
      return true
    }
    return false
  }

  request (config) {
    return this.axiosInstance_.request(config)
  }
}

class RestEndpoints {
  constructor (restEndpointList) {
    this.nameList_ = []
    this.store_ = {}
    for (const restEndpoint of restEndpointList) {
      this.store_[restEndpoint.name] = restEndpoint
      this.nameList_.push(restEndpoint.name)
    }
    this.checked_ = false
  }

  async checkReachability () {
    if (!this.checked_) {
      const result = {}
      for (const endpointName of this.nameList_) {
        result[endpointName] = await this.store_[endpointName].checkReachability()
      }
      this.checked_ = true
      return result
    }
  }

  async getReachable () {
    await this.checkReachability()
    const reachable = {}
    for (const endpointName of this.nameList_) {
      const endpoint = this.store_[endpointName]
      if (endpoint.isReachable) {
        reachable[endpointName] = endpoint
      }
    }
    return reachable
  }

  /**
   * @param {*} config
   * @param {String|Array} endpointSelector `'all'`, `'first'`, `'remote'` or  `['local', 'remote']`
   */
  async request (config, endpointSelector) {
    await this.checkReachability()

    if (!endpointSelector) {
      endpointSelector = 'first'
    }

    let requestList
    if (typeof endpointSelector === 'string') {
      if (endpointSelector === 'all') {
        requestList = this.nameList_
      } else if (endpointSelector === 'first') {
        requestList = [this.nameList_[0]]
      } else {
        requestList = [endpointSelector]
      }
    } else {
      requestList = endpointSelector
    }
    const results = {}
    for (const endpointName of requestList) {
      const endpoint = this.store_[endpointName]
      if (endpoint.isReachable) {
        results[endpointName] = await endpoint.request(config)
      }
    }
    if (Object.keys(results).length === 1) {
      for (const endpointName in results) {
        return results[endpointName]
      }
    } else {
      return results
    }
  }

  async getFirstBaseUrl () {
    await this.checkReachability()
    for (const endpointName of this.nameList_) {
      const endpoint = this.store_[endpointName]
      if (endpoint.isReachable) {
        return endpoint.baseUrl
      }
    }
  }
}

export function getDefaultRestEndpoints () {
  return new RestEndpoints([
    new RestEndpoint({
      name: 'local',
      domain: config.http.domainLocal,
      https: false,
      checkPath: 'api/version'
    }),
    new RestEndpoint({
      name: 'remote',
      domain: config.http.domainRemote,
      https: true,
      checkPath: 'api/version',
      auth: {
        username: config.http.username,
        password: config.http.password
      }
    })
  ])
}

export class HttpRequestNg {
  constructor (restEndpoints, urlFillIn) {
    this.urlFillIn = urlFillIn
    this.restEndpoints = restEndpoints
  }

  formatUrl (url) {
    if (this.urlFillIn && url.substr(0, 1) !== '/') {
      return `${this.urlFillIn}/${url}`
    }
    return url
  }

  async request (config, endpointSelector) {
    if (typeof config === 'string') {
      config = { method: 'get', url: config }
    }
    if (!('method' in config)) {
      config.method = 'get'
    }
    config.url = this.formatUrl(config.url)
    try {
      return await this.restEndpoints.request(config, endpointSelector)
    } catch (error) {
      await this.restEndpoints.checkReachability()
      return await this.restEndpoints.request(config, endpointSelector)
    }
  }
}

/** * Old Code *****************************************************************/

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
