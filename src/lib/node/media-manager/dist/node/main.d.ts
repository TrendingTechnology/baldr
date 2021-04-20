/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */
import { AssetType } from '@bldr/type-definitions';
import { DeepTitle, TitleTree } from './titles';
import { convertAsset } from './operations/convert-asset';
import { generatePresentation } from './operations/generate-presentation';
import { initializeMetaYaml } from './operations/initialize-meta-yaml';
import { normalizeMediaAsset } from './operations/normalize-asset';
import { normalizePresentationFile } from './operations/normalize-presentation';
import { renameMediaAsset } from './operations/rename-asset';
export declare const categoriesManagement: {
    detectCategoryByPath: (filePath: string) => string | undefined;
    formatFilePath: (data: AssetType.FileFormat, oldPath?: string | undefined) => string;
    process: (data: AssetType.Generic) => AssetType.Generic;
    categories: {
        cloze: import("@bldr/type-definitions/dist/node/media-category").Category;
        composition: import("@bldr/type-definitions/dist/node/media-category").Category;
        cover: import("@bldr/type-definitions/dist/node/media-category").Category;
        group: import("@bldr/type-definitions/dist/node/media-category").Category;
        instrument: import("@bldr/type-definitions/dist/node/media-category").Category;
        person: import("@bldr/type-definitions/dist/node/media-category").Category;
        photo: import("@bldr/type-definitions/dist/node/media-category").Category;
        radio: import("@bldr/type-definitions/dist/node/media-category").Category;
        recording: import("@bldr/type-definitions/dist/node/media-category").Category;
        reference: import("@bldr/type-definitions/dist/node/media-category").Category;
        score: import("@bldr/type-definitions/dist/node/media-category").Category;
        song: import("@bldr/type-definitions/dist/node/media-category").Category;
        worksheet: import("@bldr/type-definitions/dist/node/media-category").Category;
        youtube: import("@bldr/type-definitions/dist/node/media-category").Category;
        general: import("@bldr/type-definitions/dist/node/media-category").Category;
    };
    mergeNames: (...typeName: string[]) => string;
};
/**
 * A collection of function to manipulate the media assets and presentation files.
 */
export declare const operations: {
    convertAsset: typeof convertAsset;
    generatePresentation: typeof generatePresentation;
    initializeMetaYaml: typeof initializeMetaYaml;
    normalizeMediaAsset: typeof normalizeMediaAsset;
    normalizePresentationFile: typeof normalizePresentationFile;
    renameMediaAsset: typeof renameMediaAsset;
};
export * from './directory-tree-walk';
export * from './helper';
export * from './location-indicator';
export * from './media-file-classes';
export * from './titles';
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
export declare function readAssetYaml(filePath: string): AssetType.Generic | undefined;
declare const _default: {
    DeepTitle: typeof DeepTitle;
    TitleTree: typeof TitleTree;
};
export default _default;
