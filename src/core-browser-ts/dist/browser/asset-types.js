/**
 * Categories some asset file formats in three asset types: `audio`, `image`,
 * `video`.
 */
export class AssetTypes {
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
        if (extension && this.allowedExtensions[extension.toLowerCase()]) {
            return true;
        }
        return false;
    }
}
