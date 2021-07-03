import type { AssetType } from '@bldr/type-definitions';
/**
 * Rename, create metadata yaml and normalize the metadata file.
 */
export declare function initializeMetaYaml(filePath: string, metaData?: AssetType.YamlFormat): Promise<void>;
