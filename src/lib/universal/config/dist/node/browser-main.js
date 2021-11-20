"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaPath = exports.joinPath = exports.getConfig = void 0;
/**
 * Re-exports the global config object.
 */
function getConfig() {
    return config;
}
exports.getConfig = getConfig;
/**
 * A simple analog of Node.js's `path.join(...)`.
 * https://gist.github.com/creationix/7435851#gistcomment-3698888
 */
function joinPath(...segments) {
    const parts = segments.reduce((parts, segment) => {
        // Remove leading slashes from non-first part.
        if (parts.length > 0) {
            segment = segment.replace(/^\//, '');
        }
        // Remove trailing slashes.
        segment = segment.replace(/\/$/, '');
        return parts.concat(segment.split('/'));
    }, []);
    const resultParts = [];
    for (const part of parts) {
        if (part === '.') {
            continue;
        }
        if (part === '..') {
            resultParts.pop();
            continue;
        }
        resultParts.push(part);
    }
    return resultParts.join('/');
}
exports.joinPath = joinPath;
function getMediaPath(...relPath) {
    if (config == null) {
        getConfig();
    }
    return joinPath(config.mediaServer.basePath, ...relPath);
}
exports.getMediaPath = getMediaPath;
