import { assetCache } from './client-media-asset'
import { shortcutManager } from './sample'

export function resetMediaCache (): void {
  assetCache.reset()
  shortcutManager.reset()
}
