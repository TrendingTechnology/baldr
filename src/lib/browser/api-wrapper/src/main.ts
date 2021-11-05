import { makeHttpRequestInstance } from '@bldr/http-request'
import { getConfig } from '@bldr/config-ng'
import { ApiTypes } from '@bldr/type-definitions'
const config = getConfig()

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media')

export async function updateMediaServer (): Promise<ApiTypes.UpdateResult> {
  const result = await httpRequest.request('mgmt/update')
  if (result.status !== 200) {
    throw new Error('Updating the media server failed.')
  }
  return result.data
}
