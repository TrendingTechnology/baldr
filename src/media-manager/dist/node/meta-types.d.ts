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
import { MetaSpec, AssetType } from '@bldr/type-definitions';
/**
 * Check a file path against a regular expression to get the type name.
 *
 * @param filePath
 *
 * @returns The type names for example `person,group,general`
 */
declare function detectTypeByPath(filePath: string): MetaSpec.TypeNames | undefined;
/**
 * Generate the file path of the first specifed meta type.
 *
 * @param data - The mandatory property is “metaTypes” and “extension”.
 *   One can omit the property “extension”, but than you have to specify
 *   the property “mainImage”.
 * @param oldPath - The old file path.
 *
 * @returns A absolute path
 */
declare function formatFilePath(data: AssetType.FileFormat, oldPath: string): string;
/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param data - An object containing some meta data.
 */
declare function process(data: AssetType.Generic): AssetType.Generic;
declare const _default: {
    detectTypeByPath: typeof detectTypeByPath;
    formatFilePath: typeof formatFilePath;
    process: typeof process;
    typeSpecs: {
        cloze: MetaSpec.Type;
        composition: MetaSpec.Type;
        cover: MetaSpec.Type;
        group: MetaSpec.Type;
        instrument: MetaSpec.Type;
        person: MetaSpec.Type;
        photo: MetaSpec.Type;
        radio: MetaSpec.Type;
        recording: MetaSpec.Type;
        reference: MetaSpec.Type;
        score: MetaSpec.Type;
        song: MetaSpec.Type;
        worksheet: MetaSpec.Type;
        youtube: MetaSpec.Type;
        general: MetaSpec.Type;
    };
};
export default _default;
