/**
 * @file Make HTTP requests on two axios instances: local and remote.
 */

/* globals config */

import axios from 'axios'

export const defaultServer = {
  local: {
    baseUrl: config.http.domainLocal,
    https: false,
    checkUrl: 'version'
  },
  remote: {
    baseUrl: config.http.domainRemote,
    https: true,
    checkUrl: 'version',
    auth: {
      username: config.http.username,
      password: config.http.password
    }
  }
}

/**
 * connection = {
 *   name: local|remote
 *   baseUrl:
 *   https: false
 *   checkUrl: 'api/media-server/version
 * }
 */
export class Request {
  constructor (server, urlFillIn) {
    this.urlFillIn = urlFillIn
    this.defaultConfig = {
      timeout: 3000,
      crossDomain: true
    }

    this.server = server
    for (const name in this.server) {
      this.server[name] = Object.assign(this.server[name], defaultConfig)

      let httpString
      if (this.server[name].https) {
        httpString = 'https://'
      } else {
        httpString = 'http://'
      }
      this.server[name].baseUrl = `${httpString}${this.server[name].baseUrl}`
    }

    this.axiosInstances = []
  }

  /**
   * Reset the Axios instance to get a new instance. To check different
   * URL.
   */
  resetAxiosInstances_ () {
    this.axiosInstances_ = []
  }

  formatUrl (url) {
    if (this.urlFillIn && url.substr(0, 1) !== '/') {
      return `${this.urlFillIn}/${url}`
    }
    return url
  }

  isOnline () {
    return this.axiosInstances_.length > 0
  }

  async createAxiosInstances_ () {
    if (this.isOnline()) {
      return
    }
    for (const name in this.server) {
      const conn = this.server[name]
      try {
        const axiosInstance = axios.create(conn)
        await axiosInstance.get(this.formatUrl(conn.checkUrl))
        this.axiosInstances_.push(axiosInstance)
      } catch (error) {}
    }
  }

  async axiosRequest (config, requestAllServer = false) {
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
   * @param {object} config
   */
  async request (config, requestAllServer = false) {
    try {
      if (!this.isOnline()) await this.createAxiosInstances_()
      return this.axiosRequest(config, requestAllServer)
    } catch (error) {
      this.resetAxiosInstances_()
      await this.createAxiosInstance_()
      return this.axiosRequest(config, requestAllServer)
    }
  }
}

export default new Request(defaultServer)