import { convertAsset } from './operations/convert-asset';
import { fixTypography } from './operations/fix-typography';
import { generateCloze } from './operations/cloze';
import { generatePresentation } from './operations/generate-presentation';
import { initializeMetaYaml } from './operations/initialize-meta-yaml';
import { normalizeMediaAsset } from './operations/normalize-asset';
import { normalizePresentationFile } from './operations/normalize-presentation';
import { patchTexTitles } from './operations/patch-tex-titles';
import { renameByRef } from './operations/rename-by-ref';
import { renameMediaAsset } from './operations/rename-asset';
import { removeWidthHeightInSvg } from './operations/svg';
/**
 * A collection of functions to manipulate the media assets and presentation files.
 */
export declare const operations: {
    convertAsset: typeof convertAsset;
    fixTypography: typeof fixTypography;
    generateCloze: typeof generateCloze;
    generatePresentation: typeof generatePresentation;
    initializeMetaYaml: typeof initializeMetaYaml;
    normalizeMediaAsset: typeof normalizeMediaAsset;
    normalizePresentationFile: typeof normalizePresentationFile;
    patchTexTitles: typeof patchTexTitles;
    removeWidthHeightInSvg: typeof removeWidthHeightInSvg;
    renameByRef: typeof renameByRef;
    renameMediaAsset: typeof renameMediaAsset;
};
