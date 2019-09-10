/**
 * @file Make HTTP requests on two axios instances: local and remote.
 */

/* globals config */

import axios from 'axios'

export const defaultConnections = {
  local: {
    baseUrl: config.http.domainLocal,
    apiPath: 'api/media-server',
    https: false,
    checkUrl: 'version'
  },
  remote: {
    name: 'remote',
    baseUrl: config.http.domainRemote,
    apiPath: 'api/media-server',
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
class Request {
  constructor () {
    this.defaultConfig = {
      timeout: 3000,
      crossDomain: true
    }

    this.localConfig = {
      ...this.defaultConfig,
      baseURL: `http://${config.http.domainLocal}`,
      serverLocation: 'local'
    }

    this.remoteConfig = {
      ...this.defaultConfig,
      baseURL: `https://${config.http.domainRemote}`,
      auth: {
        username: config.http.username,
        password: config.http.password
      },
      serverLocation: 'remote'
    }

    this.configs = [this.localConfig, this.remoteConfig]
    this.axiosInstance_ = null
    this.serverLocation_ = null
  }

  /**
   * Reset the Axios instance to get a new instance. To check different
   * URL.
   */
  reset () {
    this.axiosInstance_ = null
    this.serverLocation_ = null
  }

  async serverLocation () {
    if (this.serverLocation_) {
      return this.serverLocation_
    }
    await this.createAxiosInstance_()
    return this.serverLocation_
  }

  async createAxiosInstance_ () {
    if (this.axiosInstance_) {
      return this.axiosInstance_
    }
    for (const conf of this.configs) {
      try {
        const axiosInstance = axios.create(conf)
        await axiosInstance.get('/api/media-server/version')
        this.axiosInstance_ = axiosInstance
        this.serverLocation_ = conf.serverLocation
        return this.axiosInstance_
      } catch (error) {}
    }
  }

  /**
   * Wrapper around axios.request. See axios.request
   *
   * @param {object} config
   */
  async request (config, requestAllConnections = false) {
    try {
      if (!this.axios) await this.createAxiosInstance_()
      return this.axiosInstance_.request(config)
    } catch (error) {
      this.reset()
      await this.createAxiosInstance_()
      return this.axiosInstance_.request(config)
    }
  }
}

export default new Request()