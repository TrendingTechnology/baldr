import { AssetCache } from './client-media-asset';
import { ShortcutManager } from './shortcuts';
const assetCache = new AssetCache();
export const shortcutManager = new ShortcutManager();
export function resetMediaCache() {
    assetCache.reset();
    shortcutManager.reset();
}
