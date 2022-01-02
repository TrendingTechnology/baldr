/**
 * Custom MIME type management.
 *
 * @module @bldr/client-media-models/mime-type
 */
import { Configuration } from '@bldr/type-definitions';
/**
 * Classifies some media asset file formats in this categories:
 * `audio`, `image`, `video`, `document`.
 */
declare class MimeTypeManager {
    private readonly config;
    private readonly allowedExtensions;
    /**
     * @param config The configuration of the BALDR project. It has to be
     * specified as a argument and is not imported via the module
     * `@bldr/config` to able to use this class in Vue projects.
     */
    constructor(config: Configuration);
    private spreadExtensions;
    /**
     * Get the MIME type from the extension.
     */
    extensionToType(extension: string): string;
    /**
     * @param filePath - The file path of the media asset.
     */
    filePathToType(filePath: string): string;
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
     */
    isAsset(filename: string): boolean;
}
export declare const mimeTypeManager: MimeTypeManager;
export {};
