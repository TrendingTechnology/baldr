import { ApiTypes } from '@bldr/type-definitions'
import { getConfig } from '@bldr/config-ng'
import { makeHttpRequestInstance } from '@bldr/http-request'

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
