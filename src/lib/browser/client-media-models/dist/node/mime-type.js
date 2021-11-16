"use strict";
/**
 * Custom MIME type management.
 *
 * @module @bldr/client-media-models/mime-type
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimeTypeManager = void 0;
const config_ng_1 = require("@bldr/config");
const config = config_ng_1.getConfig();
/**
 * Classifies some media asset file formats in this categories:
 * `audio`, `image`, `video`, `document`.
 */
class MimeTypeManager {
    /**
     * @param config The configuration of the BALDR project. It has to be
     * specified as a argument and is not imported via the module
     * `@bldr/config` to able to use this class in Vue projects.
     */
    constructor(config) {
        this.config = config.mediaServer.mimeTypes;
        this.allowedExtensions = this.spreadExtensions();
    }
    spreadExtensions() {
        const out = {};
        for (const type in this.config) {
            for (const extension of this.config[type].allowedExtensions) {
                out[extension] = type;
            }
        }
        return out;
    }
    /**
     * Get the MIME type from the extension.
     */
    extensionToType(extension) {
        extension = extension.toLowerCase();
        if (extension in this.allowedExtensions) {
            return this.allowedExtensions[extension];
        }
        throw new Error(`Unkown extension “${extension}”`);
    }
    /**
     * Get the color of the media type.
     *
     * @param type - The asset type: for example `audio`, `image`,
     *   `video`.
     */
    typeToColor(type) {
        return this.config[type].color;
    }
    /**
     * Determine the target extension (for a conversion job) by a given
     * asset type.
     *
     * @param type - The asset type: for example `audio`, `image`,
     *   `video`.
     */
    typeToTargetExtension(type) {
        return this.config[type].targetExtension;
    }
    /**
     * Check if file is an supported asset format.
     */
    isAsset(filename) {
        const extension = filename.split('.').pop();
        if (extension != null &&
            this.allowedExtensions[extension.toLowerCase()] != null) {
            return true;
        }
        return false;
    }
}
exports.mimeTypeManager = new MimeTypeManager(config);
