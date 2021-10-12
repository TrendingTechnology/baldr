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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAssetYaml = exports.setLogLevel = void 0;
const fs_1 = __importDefault(require("fs"));
const core_browser_1 = require("@bldr/core-browser");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const log = __importStar(require("@bldr/log"));
__exportStar(require("./operations"), exports);
__exportStar(require("./directory-tree-walk"), exports);
__exportStar(require("./location-indicator"), exports);
__exportStar(require("./media-file-classes"), exports);
__exportStar(require("./yaml"), exports);
function setLogLevel(level) {
    log.setLogLevel(level);
}
exports.setLogLevel = setLogLevel;
/**
 * Read the corresponding YAML file of a media asset.
 *
 * @param filePath - The path of the media asset (without the
 *   extension `.yml`).
 */
function readAssetYaml(filePath) {
    const extension = (0, core_browser_1.getExtension)(filePath);
    if (extension !== 'yml') {
        filePath = `${filePath}.yml`;
    }
    if (fs_1.default.existsSync(filePath)) {
        return (0, file_reader_writer_1.readYamlFile)(filePath);
    }
}
exports.readAssetYaml = readAssetYaml;
