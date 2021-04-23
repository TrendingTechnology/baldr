/**
 * TODO: use from client-media-classes
 *
 * Categories some asset file formats in asset types.
 *
 * @module @bldr/core-browser/asset-types
 */
/**
 * Classifies some media asset file formats in this categories:
 * `audio`, `image`, `video`, `document`.
 */
export class MediaCategoriesManager {
    /**
     * @param config The configuration of the BALDR project. It has to be
     * specifed as a argument and is not imported via the module
     * `@bldr/config` to able to use this class in Vue projects.
     */
    constructor(config) {
        this.config = config.mediaServer.assetTypes;
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
     * Get the media type from the extension.
     *
     * @param extension
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
     *
     * @param filename
     */
    isAsset(filename) {
        const extension = filename.split('.').pop();
        if (extension != null && this.allowedExtensions[extension.toLowerCase()] != null) {
            return true;
        }
        return false;
    }
}
