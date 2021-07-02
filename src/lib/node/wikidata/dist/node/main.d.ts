/**
 * @module @bldr/wikidata
 */
import { MediaCategoriesTypes } from '@bldr/type-definitions';
/**
 * Download a file from wiki commonds.
 *
 * @param fileName - The file name from wiki commonds.
 * @param dest - A file path where to store the file locally.
 */
export declare function fetchCommonsFile(fileName: string, dest: string): Promise<void>;
/**
 * Merge two objects containing metadata: a original metadata object and a
 * object obtained from wikidata. Override a property in original only if
 * `alwaysUpdate` is set on the property specification.
 */
export declare function mergeData(data: MediaCategoriesTypes.Data, dataWiki: MediaCategoriesTypes.Data, categoryCollection: MediaCategoriesTypes.Collection): MediaCategoriesTypes.Data;
/**
 * Query wikidata.
 *
 * @param itemId - for example `Q123`
 */
export declare function query(itemId: string, typeNames: MediaCategoriesTypes.Names, categoryCollection: MediaCategoriesTypes.Collection): Promise<{
    [key: string]: any;
}>;
