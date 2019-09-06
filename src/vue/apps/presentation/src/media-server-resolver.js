/**
 * @file Resolve media files.
 */

/* globals config */

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
  const domainHttpMedia = await getDomainHttpMedia()
  const domainRestApi = await getDomainRestApi()
  const postBody = {}
  postBody[key] = value
  const response = await ax.post(
    `http://${domainRestApi}:${conf.portRestApi}/query-by-${key}`,
    postBody
  )
  if ('data' in response && 'path' in response.data) {
    return `http://${domainHttpMedia}:${conf.portHttpMedia}/${response.data.path}`
  }
  throw new Error(`Media with the ${key} ”${value}” couldn’t be resolved.`)
}

export async function resolveMedia (URL) {
  if (URL in media) return media.URL
  const segments = URL.split(':')
  const schemeName = segments[0]
  const value = segments[1]

  if (schemeName === 'http' || schemeName === 'https') {
    return URL
  } else if (schemeName === 'id' || schemeName === 'filename') {
    return query(schemeName, value)
  }
  throw new Error(`The URL ”${URL}” couldn’t be resolved.`)
}
