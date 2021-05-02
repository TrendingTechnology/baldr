import { AssetType } from '@bldr/type-definitions';
/**
 * Rename, create metadata yaml and normalize the metadata file.
 *
 * @param filePath
 * @param metaData
 */
export declare function initializeMetaYaml(filePath: string, metaData?: AssetType.YamlFormat | AssetType.Generic): Promise<void>;
