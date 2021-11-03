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
interface IconDefintion {
    oldName?: string;
    description?: string;
}
/**
 * ```json
 * {
 *   "file-tree": "tree",
 *   "trumpet": "",
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
interface IconFontMapping {
    [newName: string]: false | string | IconDefintion;
}
export interface IconFontConfiguration {
    /**
     * A HTTP URL with the string `{icon}` in it. The raw Github URL of the
     * Material Design Icons Github project.
     *
     * `"https://raw.github...svg/{icon}.svg"`
     */
    urlTemplate: string;
    /**
     * A path of a directory containing some additional SVG file for some
     * extra icons in the destination icon font. To be able to extend
     * the Matertial Design icons.
     */
    additionalIconsPath: string;
    /**
     * Destination path of the generated files for distribution.
     */
    destPath: string;
    /**
     * This property is filled in by the font generator.
     */
    unicodeAssignment: {
        /**
         * `account-group: 59905`
         */
        [newName: string]: number;
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
export {};
