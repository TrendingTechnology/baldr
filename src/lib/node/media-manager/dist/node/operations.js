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
const rename_by_ref_1 = require("./operations/rename-by-ref");
const rename_asset_1 = require("./operations/rename-asset");
/**
 * A collection of functions to manipulate the media assets and presentation files.
 */
exports.operations = {
    convertAsset: convert_asset_1.convertAsset,
    fixTypography: fix_typography_1.fixTypography,
    generateCloze: cloze_1.generateCloze,
    generatePresentation: generate_presentation_1.generatePresentation,
    initializeMetaYaml: initialize_meta_yaml_1.initializeMetaYaml,
    normalizeMediaAsset: normalize_asset_1.normalizeMediaAsset,
    normalizePresentationFile: normalize_presentation_1.normalizePresentationFile,
    patchTexTitles: patch_tex_titles_1.patchTexTitles,
    renameByRef: rename_by_ref_1.renameByRef,
    renameMediaAsset: rename_asset_1.renameMediaAsset
};
