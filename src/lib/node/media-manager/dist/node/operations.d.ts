/**
 * Bundle all operations in an object
 */
import { generateCloze, patchTexTitles } from './tex';
import { normalizePresentationFile, generateAutomaticPresentation } from './presentation';
import { removeWidthHeightInSvg, fixTypography } from './txt';
import { renameMediaAsset, moveAsset, renameByRef, normalizeMediaAsset, initializeMetaYaml, convertAsset } from './asset';
import { normalize } from './normalization';
/**
 * A collection of functions to manipulate the media assets and presentation files.
 */
export declare const operations: {
    convertAsset: typeof convertAsset;
    fixTypography: typeof fixTypography;
    generateCloze: typeof generateCloze;
    generateAutomaticPresentation: typeof generateAutomaticPresentation;
    initializeMetaYaml: typeof initializeMetaYaml;
    normalize: typeof normalize;
    moveAsset: typeof moveAsset;
    normalizeMediaAsset: typeof normalizeMediaAsset;
    normalizePresentationFile: typeof normalizePresentationFile;
    patchTexTitles: typeof patchTexTitles;
    removeWidthHeightInSvg: typeof removeWidthHeightInSvg;
    renameByRef: typeof renameByRef;
    renameMediaAsset: typeof renameMediaAsset;
};
