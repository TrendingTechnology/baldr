/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */
import { AssetType } from '@bldr/type-definitions';
import { DeepTitle, TitleTree } from './titles';
export * from './yaml';
interface MoveAssetConfiguration {
    copy: boolean;
    dryRun: boolean;
}
/**
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param oldPath - The old path of a media asset.
 * @param newPath - The new path of a media asset.
 * @param opts - Some options
 */
export declare function moveAsset(oldPath: string, newPath: string, opts?: MoveAssetConfiguration): string | undefined;
/**
 * Download a URL to a destination.
 *
 * @param url - The URL.
 * @param dest - The destination. Missing parent directories are
 *   automatically created.
 */
export declare function fetchFile(url: string, dest: string): Promise<void>;
/**
 * Read the corresponding YAML file of a media asset.
 *
 * @param filePath - The path of the media asset (without the
 *   extension `.yml`).
 */
export declare function readAssetYaml(filePath: string): AssetType.Generic | undefined;
/**
 * Rename a media asset and its meta data files.
 *
 * @param oldPath - The media file path.
 *
 * @returns The new file name.
 */
export declare function renameMediaAsset(oldPath: string): string;
/**
 * Normalize a presentation file.
 *
 * Remove unnecessary single quotes around media URIs.
 *
 * @param filePath - A path of a text file.
 */
export declare function normalizePresentationFile(filePath: string): void;
declare const _default: {
    DeepTitle: typeof DeepTitle;
    TitleTree: typeof TitleTree;
};
export default _default;
