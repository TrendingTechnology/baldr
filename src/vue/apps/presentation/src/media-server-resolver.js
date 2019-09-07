/**
 * @file Resolve media files.
 */

/* globals config */

/**
 * @typedef {Object} mediumData
 * @property {string} URI - Uniform Resource Identifier, for example
 *   `id:Haydn_Joseph`, `filename:Haydn_Joseph.jpg` or
 *   `http://example.com/Haydn_Joseph.jpg`.
 * @property {string} httpURL - HTTP Uniform Resource Locator, for example
 *   `http://example.com/Haydn_Joseph.jpg`.
 * @property {string} path - The relative path on the HTTP server, for example
 *   `composer/Haydn_Joseph.jpg`.
 * @property {string} filename - The file name, for example `Haydn_Joseph.jpg`.
 * @property {string} extension - The file extension, for example `jpg`.
 * @property {string} id - An identifier, for example `Haydn_Joseph`.
 */

import axios from 'axios'

const ax = axios.create({ timeout: 3000 })

const domains = {
  restApi: null,
  httpMedia: null
}

const conf = config.mediaServer

const media = {}

async function checkDomains (domains, urlPlaceholder) {
  for (const domain of domains) {
    try {
      const url = urlPlaceholder.replace('$domain', domain)
      await ax.get(url, { crossdomain: true })
      return conf.domainLocal
    } catch (error) {}
  }
}

async function getDomainRestApi () {
  if (domains.restApi) return domains.restApi
  const domain = await checkDomains(
    [conf.domainLocal, conf.domainRemote],
    `http://$domain:${conf.portRestApi}/version`
  )
  domains.restApi = domain
  return domain
}

async function getDomainHttpMedia () {
  if (domains.httpMedia) return domains.httpMedia
  const domain = await checkDomains(
    [conf.domainLocal, conf.domainRemote],
    `http://$domain:${conf.portHttpMedia}/robots.txt`
  )
  domains.httpMedia = domain
  return domain
}

async function query (key, value) {
  const domainRestApi = await getDomainRestApi()
  const postBody = {}
  postBody[key] = value
  const response = await ax.post(
    `http://${domainRestApi}:${conf.portRestApi}/query-by-${key}`,
    postBody
  )
  if ('data' in response && 'path' in response.data) {
    return response
  }
  throw new Error(`Media with the ${key} ”${value}” couldn’t be resolved.`)
}

/**
 * @param {string} URI - Uniform Resource Identifier
 *
 * @return {mediumData}
 */
export async function retrieveMediumData (URI) {
  if (URI in media) {
    return media[URI]
  }
  const segments = URI.split(':')
  const scheme = segments[0]
  const authority = segments[1]

  let mediumData = {}
  mediumData.uriScheme = scheme
  if (scheme === 'http' || scheme === 'https') {
    mediumData.URI = URI
    mediumData.httpURL = URI
  } else if (scheme === 'id' || scheme === 'filename') {
    mediumData.URI = URI
    const response = await query(scheme, authority)
    mediumData = Object.assign(mediumData, response.data)
  }
  media[URI] = mediumData
  return mediumData
}

/**
 * @param {mediumData} mediumData
 *
 * @return {string} HTTP URL
 */
export async function generateHttpURL (mediumData) {
  if ('httpURL' in mediumData) return mediumData.httpURL
  if ('path' in mediumData) {
    const domainHttpMedia = await getDomainHttpMedia()
    return `http://${domainHttpMedia}:${conf.portHttpMedia}/${mediumData.path}`
  }
  throw new Error(`Can not generate HTTP URL.`)
}

/**
 * @param {string} URI - Uniform Resource Identifier
 *
 * @return {mediumData}
 */
export async function resolveHttpURL (URI) {
  let mediumData = await retrieveMediumData(URI)
  return generateHttpURL(mediumData)
}
