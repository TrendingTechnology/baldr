"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var media_manager_1 = require("@bldr/media-manager");
var open_with_1 = require("@bldr/open-with");
/**
 * Open the current path multiple times.
 *
 * 1. In the main media server directory
 * 2. In a archive directory structure.
 * 3. In a second archive directory structure ... and so on.
 *
 * @param filePath
 * @param createParentDir - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
function default_1(filePath, createParentDir) {
    var relPath = media_manager_1.locationIndicator.getRelPath(filePath);
    var filePaths = [];
    for (var _i = 0, _a = media_manager_1.locationIndicator.basePaths; _i < _a.length; _i++) {
        var basePath = _a[_i];
        filePaths.push(relPath != null ? path_1.default.join(basePath, relPath) : basePath);
    }
    var results = (0, open_with_1.openInFileManager)(filePaths, createParentDir);
    results.map(function (result) {
        delete result.process;
    });
    return results;
}
exports.default = default_1;
