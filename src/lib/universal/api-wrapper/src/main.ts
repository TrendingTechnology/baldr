import { ApiTypes, TitlesTypes } from '@bldr/type-definitions'
import { getConfig } from '@bldr/config'
import { makeHttpRequestInstance, AxiosRequestConfig } from '@bldr/http-request'
import { MediaUri } from '@bldr/client-media-models'

const config = getConfig()

const httpRequest = makeHttpRequestInstance(config, 'local', '/api')

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

export async function updateMediaServer (): Promise<
ApiTypes.MediaUpdateResult
> {
  return await callWithErrorMessage(
    { url: 'media', method: 'PUT' },
    'Updating the media server failed.'
  )
}

export async function getMediaStatistics (): Promise<ApiTypes.MediaStatistics> {
  return await callWithErrorMessage(
    { url: 'media', method: 'GET' },
    'Fetching of statistical informations (stats/count) failed.'
  )
}

export async function getPresentationByRef (
  ref: string
): Promise<any | undefined> {
  return await callWithErrorMessage(
    {
      url: 'media/get/presentation/by-ref',
      method: 'GET',
      params: {
        ref
      }
    },
    `The presentation with the reference “${ref}” couldn’t be resolved.`
  )
}

export async function getDynamicSelectPresentations (
  substring: string
): Promise<ApiTypes.DynamikSelectResult[]> {
  return await callWithErrorMessage(
    {
      url: 'media/get/presentations/by-substring',
      method: 'GET',
      params: {
        search: substring
      }
    },
    `Dynamic select results with the substring “${substring}” couldn’t be resolved.`
  )
}

export async function readMediaAsString (relPath: string): Promise<string> {
  return await callWithErrorMessage(
    {
      url: `/media/${relPath}`,
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }
    },
    `The media file with the path “${relPath}” couldn’t be read from the file system over HTTP.`
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
    url: 'media/get/asset',
    method: 'GET',
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

export async function getTitleTree (): Promise<TitlesTypes.TreeTitleList> {
  return await callWithErrorMessage(
    {
      url: 'media/titles',
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      params: {
        timestamp: new Date().getTime()
      }
    },
    'The title tree couldn’t be resolved.'
  )
}

interface OpenEditorParameters {
  ref: string
  type?: 'presentation' | 'asset'
  dryRun?: boolean
}

export async function openEditor (
  params: OpenEditorParameters
): Promise<ApiTypes.OpenEditorResult> {
  return await callWithErrorMessage(
    { url: 'media/open/editor', params },
    `Could not open the media file with the reference “${params.ref}” in the editor.`
  )
}

interface OpenFileManagerParameters {
  ref: string
  type?: 'presentation' | 'asset'
  create?: boolean
  archive?: boolean
  dryRun?: boolean
}

export async function openFileManager (
  params: OpenFileManagerParameters
): Promise<ApiTypes.OpenInFileManagerResult> {
  return await callWithErrorMessage(
    { url: 'media/open/file-manager', params },
    `Could not open the media file with the reference “${params.ref}” in the file manager.`
  )
}
