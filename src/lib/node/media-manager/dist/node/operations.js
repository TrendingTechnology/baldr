"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operations = void 0;
// Operations
const convert_asset_1 = require("./operations/convert-asset");
const fix_typography_1 = require("./operations/fix-typography");
const cloze_1 = require("./operations/cloze");
const generate_presentation_1 = require("./operations/generate-presentation");
const initialize_meta_yaml_1 = require("./operations/initialize-meta-yaml");
const normalize_asset_1 = require("./operations/normalize-asset");
const normalize_presentation_1 = require("./operations/normalize-presentation");
const patch_tex_titles_1 = require("./operations/patch-tex-titles");
const svg_1 = require("./operations/svg");
const asset_1 = require("./asset");
/**
 * A collection of functions to manipulate the media assets and presentation files.
 */
exports.operations = {
    convertAsset: convert_asset_1.convertAsset,
    fixTypography: fix_typography_1.fixTypography,
    generateCloze: cloze_1.generateCloze,
    generatePresentation: generate_presentation_1.generatePresentation,
    initializeMetaYaml: initialize_meta_yaml_1.initializeMetaYaml,
    moveAsset: asset_1.moveAsset,
    normalizeMediaAsset: normalize_asset_1.normalizeMediaAsset,
    normalizePresentationFile: normalize_presentation_1.normalizePresentationFile,
    patchTexTitles: patch_tex_titles_1.patchTexTitles,
    removeWidthHeightInSvg: svg_1.removeWidthHeightInSvg,
    renameByRef: asset_1.renameByRef,
    renameMediaAsset: asset_1.renameMediaAsset
};
