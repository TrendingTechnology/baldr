"use strict";
/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogLevel = exports.mimeTypeManager = exports.readAssetYaml = void 0;
const log = __importStar(require("@bldr/log"));
__exportStar(require("./operations"), exports);
__exportStar(require("./directory-tree-walk"), exports);
__exportStar(require("./location-indicator"), exports);
__exportStar(require("./media-file-classes"), exports);
__exportStar(require("./yaml"), exports);
var asset_1 = require("./asset");
Object.defineProperty(exports, "readAssetYaml", { enumerable: true, get: function () { return asset_1.readAssetYaml; } });
var client_media_models_1 = require("@bldr/client-media-models");
Object.defineProperty(exports, "mimeTypeManager", { enumerable: true, get: function () { return client_media_models_1.mimeTypeManager; } });
function setLogLevel(level) {
    log.setLogLevel(level);
}
exports.setLogLevel = setLogLevel;
