import { assetCache } from './client-media-asset';
import { shortcutManager } from './sample';
export function resetMediaCache() {
    assetCache.reset();
    shortcutManager.reset();
}
