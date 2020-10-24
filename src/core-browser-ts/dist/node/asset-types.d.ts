import { Configuration } from '@bldr/type-definitions';
/**
 * Categories some asset file formats in three asset types: `audio`, `image`,
 * `video`.
 */
export declare class AssetTypes {
    private config;
    private allowedExtensions;
    constructor(config: Configuration);
    private spreadExtensions;
    /**
     * Get the media type from the extension.
     *
     * @param extension
     */
    extensionToType(extension: string): string;
    /**
     * Get the color of the media type.
     *
     * @param type - The asset type: for example `audio`, `image`,
     *   `video`.
     */
    typeToColor(type: string): string;
    /**
     * Determine the target extension (for a conversion job) by a given
     * asset type.
     *
     * @param type - The asset type: for example `audio`, `image`,
     *   `video`.
     */
    typeToTargetExtension(type: string): string;
    /**
     * Check if file is an supported asset format.
     *
     * @param filename
     */
    isAsset(filename: string): boolean;
}
