"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMediaCache = exports.shortcutManager = void 0;
const client_media_asset_1 = require("./client-media-asset");
const shortcuts_1 = require("./shortcuts");
const assetCache = new client_media_asset_1.AssetCache();
exports.shortcutManager = new shortcuts_1.ShortcutManager();
function resetMediaCache() {
    assetCache.reset();
    exports.shortcutManager.reset();
}
exports.resetMediaCache = resetMediaCache;
