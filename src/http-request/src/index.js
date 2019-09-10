/**
 * @file Make HTTP requests on two axios instances: local and remote.
 */

/* globals config */

import axios from 'axios'

export const defaultServers = {
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

export class Request {
  constructor (servers, urlFillIn) {
    this.urlFillIn = urlFillIn
    this.defaultConfig = {
      timeout: 3000,
      crossDomain: true
    }

    // We change the object so we need a deep clone.
    this.servers = JSON.parse(JSON.stringify(servers))
    for (const name in this.servers) {
      this.servers[name] = Object.assign(this.servers[name], this.defaultConfig)

      let httpString
      if (this.servers[name].https) {
        httpString = 'https://'
      } else {
        httpString = 'http://'
      }
      delete this.servers[name].https
      this.servers[name].baseURL = `${httpString}${this.servers[name].baseURL}`
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

  initalised () {
    return this.axiosInstances_.length > 0
  }

  async createAxiosInstances_ () {
    if (this.initalised()) {
      return
    }
    for (const name in this.servers) {
      const conn = this.servers[name]
      try {
        const axiosInstance = axios.create(conn)
        axiosInstance.get(this.formatUrl(conn.checkUrl))
        this.axiosInstances_.push(axiosInstance)
      } catch (error) {}
    }
  }

  async getFirstBaseURL () {
    await this.createAxiosInstances_()
    if (this.initalised()) return this.axiosInstances_[0].defaults.baseURL
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
   * @param {object} config
   */
  async request (config, requestAllServer = false) {
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

export default new Request(defaultServers)