/**
 * @module @bldr/wikidata
 */
import { MetaSpec } from '@bldr/type-definitions';
/**
 * Download a file from wiki commonds.
 *
 * @param {String} fileName - The file name from wiki commonds.
 * @param {String} dest - A file path where to store the file locally.
 */
declare function fetchCommonsFile(fileName: string, dest: string): Promise<void>;
/**
 * Merge two objects containing metadata: a original metadata object and a
 * object obtained from wikidata. Override a property in original only if
 * `alwaysUpdate` is set on the property specification.
 *
 * @param dataOrig
 * @param dataWiki
 * @param typeSpecs
 */
declare function mergeData(data: MetaSpec.Data, dataWiki: MetaSpec.Data, typeSpecs: MetaSpec.TypeCollection): MetaSpec.Data;
/**
 * Query wikidata.
 *
 * @param itemId - for example `Q123`
 * @param typeNames
 * @param typeSpecs
 */
declare function query(itemId: string, typeNames: MetaSpec.TypeNames, typeSpecs: MetaSpec.TypeCollection): Promise<object>;
declare const _default: {
    fetchCommonsFile: typeof fetchCommonsFile;
    mergeData: typeof mergeData;
    query: typeof query;
};
export default _default;
