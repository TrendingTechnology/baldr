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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogLevel = exports.writeYamlMetaData = exports.readYamlMetaData = exports.isTex = exports.isPresentation = exports.isAsset = exports.locationIndicator = exports.walk = exports.operations = exports.mimeTypeManager = exports.buildMinimalAssetData = void 0;
const log = __importStar(require("@bldr/log"));
var media_data_collector_1 = require("@bldr/media-data-collector");
Object.defineProperty(exports, "buildMinimalAssetData", { enumerable: true, get: function () { return media_data_collector_1.buildMinimalAssetData; } });
var client_media_models_1 = require("@bldr/client-media-models");
Object.defineProperty(exports, "mimeTypeManager", { enumerable: true, get: function () { return client_media_models_1.mimeTypeManager; } });
var operations_1 = require("./operations");
Object.defineProperty(exports, "operations", { enumerable: true, get: function () { return operations_1.operations; } });
var directory_tree_walk_1 = require("./directory-tree-walk");
Object.defineProperty(exports, "walk", { enumerable: true, get: function () { return directory_tree_walk_1.walk; } });
var location_indicator_1 = require("./location-indicator");
Object.defineProperty(exports, "locationIndicator", { enumerable: true, get: function () { return location_indicator_1.locationIndicator; } });
var media_file_classes_1 = require("./media-file-classes");
Object.defineProperty(exports, "isAsset", { enumerable: true, get: function () { return media_file_classes_1.isAsset; } });
Object.defineProperty(exports, "isPresentation", { enumerable: true, get: function () { return media_file_classes_1.isPresentation; } });
Object.defineProperty(exports, "isTex", { enumerable: true, get: function () { return media_file_classes_1.isTex; } });
var yaml_1 = require("./yaml");
Object.defineProperty(exports, "readYamlMetaData", { enumerable: true, get: function () { return yaml_1.readYamlMetaData; } });
Object.defineProperty(exports, "writeYamlMetaData", { enumerable: true, get: function () { return yaml_1.writeYamlMetaData; } });
function setLogLevel(level) {
    log.setLogLevel(level);
}
exports.setLogLevel = setLogLevel;
