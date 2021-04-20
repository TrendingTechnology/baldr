/**
 * Code to manage and process the meta data types of the media server.
 *
 * A media asset can be attached to multiple meta data types (for example:
 * `meta_types: recording,composition`). All meta data types belong to the type
 * `general`. The meta type `general` is applied at the end.
 *
 * The meta data types are specified in the module
 * {@link module:@bldr/media-server/meta-type-specs meta-type-specs}
 *
 * @module @bldr/media-manager/meta-types
 */
import { MediaCategory, AssetType } from '@bldr/type-definitions';
/**
 * Check a file path against a regular expression to get the type name.
 *
 * @param filePath
 *
 * @returns The type names for example `person,group,general`
 */
declare function detectCategoryByPath(filePath: string): MediaCategory.Names | undefined;
/**
 * Generate the file path of the first specifed meta type.
 *
 * @param data - The mandatory property is “categories” and “extension”.
 *   One can omit the property “extension”, but than you have to specify
 *   the property “mainImage”.
 * @param oldPath - The old file path.
 *
 * @returns A absolute path
 */
declare function formatFilePath(data: AssetType.FileFormat, oldPath?: string): string;
/**
 * Merge category names to avoid duplicate metadata category names:
 */
declare function mergeNames(...typeName: string[]): string;
/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param data - An object containing some meta data.
 */
declare function process(data: AssetType.FileFormat): AssetType.FileFormat;
declare const _default: {
    detectCategoryByPath: typeof detectCategoryByPath;
    formatFilePath: typeof formatFilePath;
    process: typeof process;
    categories: {
        cloze: MediaCategory.Category;
        composition: MediaCategory.Category;
        cover: MediaCategory.Category;
        group: MediaCategory.Category;
        instrument: MediaCategory.Category;
        person: MediaCategory.Category;
        photo: MediaCategory.Category;
        radio: MediaCategory.Category;
        recording: MediaCategory.Category;
        reference: MediaCategory.Category;
        score: MediaCategory.Category;
        song: MediaCategory.Category;
        worksheet: MediaCategory.Category;
        youtube: MediaCategory.Category;
        general: MediaCategory.Category;
    };
    mergeNames: typeof mergeNames;
};
export default _default;
