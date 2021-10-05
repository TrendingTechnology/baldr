/**
 * ```json
 * {
 *   "text-box-multiple-outline": {
 *     "oldName": "multi-part",
 *     "description": "multipart assets"
 *   },
 *   "cloud-download": {
 *      "description": "Master slide youtube for download (cached) video file with an asset."
 *   }
 * }
 * ```
 */
export interface IconDefintion {
    oldName?: string;
    description?: string;
}
/**
 * ```json
 * {
 *   "file-tree": "tree",
 *   "trumpet": "",
 *   "text-box-multiple-outline": {
 *     "newName": "multi-part",
 *     "description": "multipart assets"
 *   },
 *   "cloud-download": {
 *      "description": "Master slide youtube for download (cached) video file with an asset."
 *   }
 * }
 * ```
 */
export interface IconFontMapping {
    [newName: string]: false | string | IconDefintion;
}
export interface IconFontConfiguration {
    /**
     * `"https://raw.github...svg/{icon}.svg"`
     */
    urlTemplate: string;
    /**
     * Destination path of the generated files for distribution.
     */
    distPath: string;
    /**
     * This property is filled in by the font generator.
     */
    unicodeAssigment: {
        [iconName: string]: string;
    };
    /**
     * ```json
     * {
     *   "file-tree": "tree",
     *   "trumpet": "",
     *   "text-box-multiple-outline": {
     *     "newName": "multi-part",
     *     "description": "multipart assets"
     *   },
     *   "cloud-download": {
     *      "description": "Master slide youtube for download (cached) video file with an asset."
     *   }
     * }
     * ```
     */
    iconMapping: IconFontMapping;
}
