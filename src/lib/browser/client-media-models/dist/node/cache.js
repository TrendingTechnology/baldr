"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMediaCache = void 0;
const client_media_asset_1 = require("./client-media-asset");
const sample_1 = require("./sample");
function resetMediaCache() {
    client_media_asset_1.assetCache.reset();
    sample_1.shortcutManager.reset();
}
exports.resetMediaCache = resetMediaCache;
