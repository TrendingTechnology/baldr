/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */
import { MediaResolverTypes } from '@bldr/type-definitions';
import { convertAsset } from './operations/convert-asset';
import { fixTypography } from './operations/fix-typography';
import { generatePresentation } from './operations/generate-presentation';
import { initializeMetaYaml } from './operations/initialize-meta-yaml';
import { normalizeMediaAsset } from './operations/normalize-asset';
import { normalizePresentationFile } from './operations/normalize-presentation';
import { patchTexTitles } from './operations/patch-tex-titles';
import { renameByRef } from './operations/rename-by-ref';
import { renameMediaAsset } from './operations/rename-asset';
/**
 * A collection of function to manipulate the media assets and presentation files.
 */
export declare const operations: {
    convertAsset: typeof convertAsset;
    fixTypography: typeof fixTypography;
    generatePresentation: typeof generatePresentation;
    initializeMetaYaml: typeof initializeMetaYaml;
    normalizeMediaAsset: typeof normalizeMediaAsset;
    normalizePresentationFile: typeof normalizePresentationFile;
    patchTexTitles: typeof patchTexTitles;
    renameByRef: typeof renameByRef;
    renameMediaAsset: typeof renameMediaAsset;
};
export * from './directory-tree-walk';
export * from './location-indicator';
export * from './media-file-classes';
export * from './yaml';
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
 */
export declare function moveAsset(oldPath: string, newPath: string, opts?: MoveAssetConfiguration): string | undefined;
/**
 * Read the corresponding YAML file of a media asset.
 *
 * @param filePath - The path of the media asset (without the
 *   extension `.yml`).
 */
export declare function readAssetYaml(filePath: string): MediaResolverTypes.YamlFormat | undefined;
