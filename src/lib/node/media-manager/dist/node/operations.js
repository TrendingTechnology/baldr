"use strict";
/**
 * Bundle all operations in an object.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.operations = void 0;
const tex_1 = require("./tex");
const presentation_1 = require("./presentation");
const txt_1 = require("./txt");
const asset_1 = require("./asset");
const normalization_1 = require("./normalization");
/**
 * A collection of functions to manipulate the media asset and presentation
 * files.
 */
exports.operations = {
    convertAsset: asset_1.convertAsset,
    fixTypography: txt_1.fixTypography,
    generateCloze: tex_1.generateCloze,
    generateAutomaticPresentation: presentation_1.generateAutomaticPresentation,
    initializeMetaYaml: asset_1.initializeMetaYaml,
    normalize: normalization_1.normalize,
    moveAsset: asset_1.moveAsset,
    normalizeMediaAsset: asset_1.normalizeMediaAsset,
    normalizePresentationFile: presentation_1.normalizePresentationFile,
    patchTexTitles: tex_1.patchTexTitles,
    removeWidthHeightInSvg: txt_1.removeWidthHeightInSvg,
    renameByRef: asset_1.renameByRef,
    renameMediaAsset: asset_1.renameMediaAsset
};
