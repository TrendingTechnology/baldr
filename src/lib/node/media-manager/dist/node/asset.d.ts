import { MediaResolverTypes } from '@bldr/type-definitions';
interface MoveAssetConfiguration {
    copy?: boolean;
    dryRun?: boolean;
}
/**
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param oldPath - The old path of a media asset.
 * @param newPath - The new path of a media asset.
 * @param opts - Some options
 *
 * @returns The new path.
 */
export declare function moveAsset(oldPath: string, newPath: string, opts?: MoveAssetConfiguration): string | undefined;
/**
 * Rename a media asset and its meta data files.
 *
 * @param oldPath - The media file path.
 *
 * @returns The new file name.
 */
export declare function renameMediaAsset(oldPath: string): string;
/**
 * Rename a media asset after the `ref` (reference) property in the metadata file.
 *
 * @param filePath - The media asset file path.
 */
export declare function renameByRef(filePath: string): void;
interface NormalizeMediaAssetOption {
    wikidata?: boolean;
}
/**
 * Normalize a media asset file.
 *
 * @param filePath - The media asset file path.
 */
export declare function normalizeMediaAsset(filePath: string, options?: NormalizeMediaAssetOption): Promise<void>;
/**
 * Rename, create metadata yaml and normalize the metadata file.
 */
export declare function initializeMetaYaml(filePath: string, metaData?: MediaResolverTypes.YamlFormat): Promise<void>;
/**
 * Convert a media asset file.
 *
 * @param filePath - The path of the input file.
 * @param cmdObj - The command object from the commander.
 *
 * @returns The output file path.
 */
export declare function convertAsset(filePath: string, cmdObj?: {
    [key: string]: any;
}): Promise<string | undefined>;
export {};
