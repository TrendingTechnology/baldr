/**
 * Bundle all operations in an object.
 */
import { generateCloze, patchTexTitles } from './tex';
import { normalizePresentationFile, generateAutomaticPresentation } from './presentation';
import { removeWidthHeightInSvg, fixTypography } from './txt';
import { renameMediaAsset, moveAsset, renameByRef, normalizeMediaAsset, initializeMetaYaml, convertAsset } from './asset';
import { normalize } from './normalization';
import convertAudacitySamples from './operations/audacity-samples';
/**
 * A collection of functions to manipulate the media asset and presentation
 * files.
 */
export declare const operations: {
    convertAsset: typeof convertAsset;
    convertAudacitySamples: typeof convertAudacitySamples;
    fixTypography: typeof fixTypography;
    generateAutomaticPresentation: typeof generateAutomaticPresentation;
    generateCloze: typeof generateCloze;
    initializeMetaYaml: typeof initializeMetaYaml;
    moveAsset: typeof moveAsset;
    normalize: typeof normalize;
    normalizeMediaAsset: typeof normalizeMediaAsset;
    normalizePresentationFile: typeof normalizePresentationFile;
    patchTexTitles: typeof patchTexTitles;
    removeWidthHeightInSvg: typeof removeWidthHeightInSvg;
    renameByRef: typeof renameByRef;
    renameMediaAsset: typeof renameMediaAsset;
};
