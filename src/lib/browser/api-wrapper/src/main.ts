import { ApiTypes } from '@bldr/type-definitions'
import { getConfig } from '@bldr/config'
import { makeHttpRequestInstance, AxiosRequestConfig } from '@bldr/http-request'
import { MediaUri } from '@bldr/client-media-models'

const config = getConfig()

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media')

async function callWithErrorMessage (
  requestConfig: string | AxiosRequestConfig,
  errorMessage: string
): Promise<any> {
  const result = await httpRequest.request(requestConfig)
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
    url: 'get/asset',
    method: 'get',
    params: {
      [mediaUri.scheme]: mediaUri.authority
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

interface OpenEditorParameters {
  ref: string
  type?: 'presentation' | 'asset'
  dryRun?: boolean
}

export async function openEditor (params: OpenEditorParameters) {
  return await callWithErrorMessage(
    { url: 'open/editor', params },
    'Open Editor.'
  )
}

interface OpenFileManagerParameters {
  ref: string
  type?: 'presentation' | 'asset'
  create?: boolean
  archive?: boolean
  dryRun?: boolean
}

export async function openFileManager (params: OpenFileManagerParameters) {
  return await callWithErrorMessage(
    { url: 'open/file-manager', params },
    'Open Editor.'
  )
}

export default {
  media: {
    open: {
      editor: openEditor,
      fileManager: openFileManager
    }
  }
}
