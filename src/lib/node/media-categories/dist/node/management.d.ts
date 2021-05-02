/**
 * Code to manage and process the meta data types of the media server.
 *
 * A media asset can be attached to multiple meta data types (for example:
 * `meta_types: recording,composition`). All meta data types belong to the type
 * `general`. The media category `general` is applied at the end.
 *
 * The meta data types are specified in the module
 * {@link module:@bldr/media-server/meta-type-specs meta-type-specs}
 *
 * @module @bldr/media-manager/meta-types
 */
import type { MediaCategory, AssetType } from '@bldr/type-definitions';
/**
 * Check a file path against a regular expression to get the category name.
 *
 * @returns The category names for example `person,group,general`
 */
export declare function detectCategoryByPath(filePath: string): MediaCategory.Names | undefined;
/**
 * Generate the file path of the first specifed media category.
 *
 * @param data - The mandatory property is “categories” and “extension”.
 *   One can omit the property “extension”, but than you have to specify
 *   the property “mainImage”.
 * @param oldPath - The old file path.
 *
 * @returns A absolute path
 */
export declare function formatFilePath(data: AssetType.YamlFormat, oldPath?: string): string | undefined;
/**
 * Merge category names to avoid duplicate metadata category names:
 */
export declare function mergeNames(...name: string[]): string;
/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param data - An object containing some meta data.
 * @param filePath - The path of media asset itself, not the metadata
 *   `*.extension.yml` file.
 */
export declare function process(data: AssetType.YamlFormat, filePath?: string): AssetType.YamlFormat;
