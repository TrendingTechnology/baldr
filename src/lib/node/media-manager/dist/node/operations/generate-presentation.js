"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePresentation = void 0;
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Project packages.
const tex_markdown_converter_1 = require("@bldr/tex-markdown-converter");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const yaml_1 = require("@bldr/yaml");
const media_file_classes_1 = require("../media-file-classes");
const directory_tree_walk_1 = require("../directory-tree-walk");
function slidify(masterName, data, topLevelData) {
    function slidifySingle(masterName, data) {
        const slide = {};
        slide[masterName] = data;
        if (topLevelData != null)
            Object.assign(slide, topLevelData);
        return slide;
    }
    if (Array.isArray(data)) {
        const result = [];
        for (const item of data) {
            result.push(slidifySingle(masterName, item));
        }
        return result;
    }
    else {
        return [slidifySingle(masterName, data)];
    }
}
/**
 * Create a Praesentation.baldr.yml file and insert all media assets in
 * the presentation.
 *
 * @param filePath - The file path of the new created presentation
 *   template.
 */
function generatePresentation(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const basePath = path_1.default.dirname(filePath);
        let slides = [];
        yield (0, directory_tree_walk_1.walk)({
            asset(relPath) {
                const asset = (0, media_file_classes_1.makeAsset)(relPath);
                if (asset.ref == null) {
                    return;
                }
                let masterName = 'generic';
                if (asset.ref.includes('_LT')) {
                    masterName = 'cloze';
                }
                else if (asset.ref.includes('NB')) {
                    masterName = 'score_sample';
                }
                else if (asset.mediaCategory != null) {
                    masterName = asset.mediaCategory;
                }
                const slideData = {
                    [masterName]: `ref:${asset.ref}`
                };
                slides.push(slideData);
            }
        }, { path: basePath });
        const notePath = path_1.default.join(basePath, 'Hefteintrag.tex');
        if (fs_1.default.existsSync(notePath)) {
            const noteContent = (0, file_reader_writer_1.readFile)(notePath);
            slides = slides.concat(slidify('note', (0, tex_markdown_converter_1.objectifyTexItemize)(noteContent), { source: 'Hefteintrag.tex' }));
        }
        const worksheetPath = path_1.default.join(basePath, 'Arbeitsblatt.tex');
        if (fs_1.default.existsSync(worksheetPath)) {
            const worksheetContent = (0, file_reader_writer_1.readFile)(worksheetPath);
            slides = slides.concat(slidify('quote', (0, tex_markdown_converter_1.objectifyTexZitat)(worksheetContent), { source: 'Arbeitsblatt.tex' }));
        }
        const result = (0, yaml_1.convertToYaml)({
            slides
        });
        console.log(result);
        (0, file_reader_writer_1.writeFile)(filePath, result);
    });
}
exports.generatePresentation = generatePresentation;
