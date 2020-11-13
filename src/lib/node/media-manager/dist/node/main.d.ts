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
export declare const metaTypes: {
    detectTypeByPath: (filePath: string) => string | undefined;
    formatFilePath: (data: AssetType.FileFormat, oldPath?: string | undefined) => string;
    process: (data: AssetType.Generic) => AssetType.Generic;
    typeSpecs: {
        cloze: import("@bldr/type-definitions").MetaSpec.Type;
        composition: import("@bldr/type-definitions").MetaSpec.Type;
        cover: import("@bldr/type-definitions").MetaSpec.Type;
        group: import("@bldr/type-definitions").MetaSpec.Type;
        instrument: import("@bldr/type-definitions").MetaSpec.Type;
        person: import("@bldr/type-definitions").MetaSpec.Type;
        photo: import("@bldr/type-definitions").MetaSpec.Type;
        radio: import("@bldr/type-definitions").MetaSpec.Type;
        recording: import("@bldr/type-definitions").MetaSpec.Type;
        reference: import("@bldr/type-definitions").MetaSpec.Type;
        score: import("@bldr/type-definitions").MetaSpec.Type;
        song: import("@bldr/type-definitions").MetaSpec.Type;
        worksheet: import("@bldr/type-definitions").MetaSpec.Type;
        youtube: import("@bldr/type-definitions").MetaSpec.Type;
        general: import("@bldr/type-definitions").MetaSpec.Type;
    };
    mergeTypeNames: (...typeName: string[]) => string;
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
