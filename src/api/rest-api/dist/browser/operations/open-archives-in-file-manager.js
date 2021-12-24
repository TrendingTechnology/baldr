import path from 'path';
import { locationIndicator } from '@bldr/media-manager';
import { openInFileManager } from '@bldr/open-with';
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
export default function (filePath, createParentDir) {
    var relPath = locationIndicator.getRelPath(filePath);
    var filePaths = [];
    for (var _i = 0, _a = locationIndicator.basePaths; _i < _a.length; _i++) {
        var basePath = _a[_i];
        filePaths.push(relPath != null ? path.join(basePath, relPath) : basePath);
    }
    var results = openInFileManager(filePaths, createParentDir);
    results.map(function (result) {
        delete result.process;
    });
    return results;
}
