import { ApiTypes } from '@bldr/type-definitions'
import { getConfig } from '@bldr/config'
import { makeHttpRequestInstance } from '@bldr/http-request'
import { MediaUri } from '@bldr/client-media-models'

const config = getConfig()

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media')

async function callWithErrorMessage (
  path: string,
  errorMessage: string
): Promise<any> {
  const result = await httpRequest.request(path)
  if (result.status !== 200) {
    throw new Error(errorMessage)
  }
  return result.data
}

export async function updateMediaServer (): Promise<ApiTypes.UpdateResult> {
  return await callWithErrorMessage(
    'mgmt/update',
    'Updating the media server failed.'
  )
}

export async function getStatsCount (): Promise<ApiTypes.Count> {
  return await callWithErrorMessage(
    'stats/count',
    'Fetching of statistical informations (stats/count) failed.'
  )
}

export async function getStatsUpdates (): Promise<ApiTypes.Task[]> {
  return await callWithErrorMessage(
    'stats/updates',
    'Fetching of statistical informations (stats/updates) failed.'
  )
}

export async function getAssetByUri (
  uri: string,
  throwException: boolean = true
): Promise<any | undefined> {
  const mediaUri = new MediaUri(uri)
  const field = mediaUri.scheme
  const search = mediaUri.authority
  const response = await httpRequest.request({
    url: 'query',
    method: 'get',
    params: {
      type: 'assets',
      method: 'exactMatch',
      field: field,
      search: search
    }
  })
  if (response == null || response.status !== 200 || response.data == null) {
    if (throwException) {
      throw new Error(
        `The media with the ${field} ”${search}” couldn’t be resolved.`
      )
    }
  } else {
    return response.data
  }
}
