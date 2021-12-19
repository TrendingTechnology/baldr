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
 * @param currentPath
 * @param create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
function default_1(currentPath, create) {
    var result = {};
    var relPath = media_manager_1.locationIndicator.getRelPath(currentPath);
    for (var _i = 0, _a = media_manager_1.locationIndicator.basePaths; _i < _a.length; _i++) {
        var basePath = _a[_i];
        if (relPath != null) {
            var currentPath_1 = path_1.default.join(basePath, relPath);
            result[currentPath_1] = (0, open_with_1.openInFileManager)(currentPath_1, create);
        }
        else {
            result[basePath] = (0, open_with_1.openInFileManager)(basePath, create);
        }
    }
    return result;
}
exports.default = default_1;
