/**
 * @module @bldr/wikidata
 */
import { MediaCategory } from '@bldr/type-definitions';
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
export declare function mergeData(data: MediaCategory.Data, dataWiki: MediaCategory.Data, categoryCollection: MediaCategory.Collection): MediaCategory.Data;
/**
 * Query wikidata.
 *
 * @param itemId - for example `Q123`
 */
export declare function query(itemId: string, typeNames: MediaCategory.Names, categoryCollection: MediaCategory.Collection): Promise<{
    [key: string]: any;
}>;
