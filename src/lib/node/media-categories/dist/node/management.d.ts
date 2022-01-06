/**
 * Code to manage and process the metadata categories of the media server.
 *
 * A media asset can be attached to multiple metadata categories (for example:
 * `categories: recording,composition`). All metadata categories belong to the
 * type `general`. The media category `general` is applied at the end.
 *
 * @module @bldr/media-categories
 */
import { MediaCategoriesTypes, MediaDataTypes } from '@bldr/type-definitions';
/**
 * Check a file path against a regular expression to get the category name.
 *
 * @returns The category names for example `person,group,general`
 */
export declare function detectCategoryByPath(filePath: string): MediaCategoriesTypes.Names | undefined;
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
export declare function formatFilePath(data: MediaDataTypes.AssetMetaData, oldPath?: string): string | undefined;
/**
 * Merge category names to avoid duplicate metadata category names:
 */
export declare function mergeNames(...name: string[]): string;
/**
 * @returns An array of unknown props.
 */
export declare function searchUnknownProps(data: MediaDataTypes.AssetMetaData): string[];
/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @TODO Use different type for data (without mandatory uuid)
 *
 * @param data - An object containing some meta data.
 * @param filePath - The path of media asset itself, not the metadata
 *   `*.extension.yml` file.
 */
export declare function process(data: MediaDataTypes.AssetMetaData, filePath?: string): Promise<MediaDataTypes.AssetMetaData>;
