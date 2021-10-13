"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.generatePresentation = exports.normalizePresentationFile = void 0;
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Project packages.
const tex_markdown_converter_1 = require("@bldr/tex-markdown-converter");
const yaml_1 = require("@bldr/yaml");
const media_file_classes_1 = require("./media-file-classes");
const directory_tree_walk_1 = require("./directory-tree-walk");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const core_browser_1 = require("@bldr/core-browser");
const titles_1 = require("@bldr/titles");
const log = __importStar(require("@bldr/log"));
const comment = `
#-----------------------------------------------------------------------
#
#-----------------------------------------------------------------------
`;
/**
 * Remove unnecessary single quotes.
 *
 * js-yaml add single quotes arround the media URIs, for example
 * `'ref:fuer-elise'`.
 *
 * @param rawYamlString - A raw YAML string (not converted into a
 *   Javascript object).
 *
 * @returns A raw YAML string without single quotes around the media
 *   URIs.
 */
function removeSingleQuotes(rawYamlString) {
    return rawYamlString.replace(/ 'ref:([^']*)'/g, ' ref:$1');
}
/**
 * Shorten all media URIs in a presentation file.
 *
 * The presentation is not converted into YAML. This function operates
 * by replacing text substrings.
 *
 * @param rawYamlString - A raw YAML string (not converted into a
 *   Javascript object).
 * @param presentationId - The ID of a presentation.
 *
 * @returns A raw YAML string without single quotes around the media
 *   URIs.
 */
function shortedMediaUris(rawYamlString, presentationId) {
    return rawYamlString.replace(new RegExp(`ref:${presentationId}_`, 'g'), 'ref:./');
}
/**
 * Normalize a presentation file.
 *
 * Remove unnecessary single quotes around media URIs.
 *
 * @param filePath - A path of a text file.
 */
function normalizePresentationFile(filePath) {
    var _a, _b, _c;
    let textContent = (0, file_reader_writer_1.readFile)(filePath);
    const oldTextContent = textContent;
    const presentation = (0, file_reader_writer_1.readYamlFile)(filePath);
    // Generate meta.
    const title = new titles_1.DeepTitle(filePath);
    const meta = title.generatePresetationMeta();
    if (((_a = presentation === null || presentation === void 0 ? void 0 : presentation.meta) === null || _a === void 0 ? void 0 : _a.ref) != null) {
        meta.ref = presentation.meta.ref;
    }
    if (((_b = presentation === null || presentation === void 0 ? void 0 : presentation.meta) === null || _b === void 0 ? void 0 : _b.curriculumUrl) != null) {
        meta.curriculumUrl = presentation.meta.curriculumUrl;
    }
    if (((_c = presentation === null || presentation === void 0 ? void 0 : presentation.meta) === null || _c === void 0 ? void 0 : _c.uuid) == null) {
        meta.uuid = (0, core_browser_1.genUuid)();
    }
    else {
        meta.uuid = presentation.meta.uuid;
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const metaSorted = {};
    metaSorted.ref = meta.ref;
    if (meta.uuid != null) {
        metaSorted.uuid = meta.uuid;
    }
    metaSorted.title = meta.title;
    metaSorted.subtitle = meta.subtitle;
    metaSorted.subject = meta.subject;
    metaSorted.grade = meta.grade;
    metaSorted.curriculum = meta.curriculum;
    if (meta.curriculumUrl != null) {
        metaSorted.curriculumUrl = meta.curriculumUrl;
    }
    const metaString = (0, yaml_1.convertToYaml)({ meta: metaSorted });
    textContent = textContent.replace(/.*\nslides:/s, metaString + comment + '\nslides:');
    // Shorten media URIs with `./`
    if (meta.ref != null) {
        textContent = shortedMediaUris(textContent, meta.ref);
    }
    textContent = removeSingleQuotes(textContent);
    // Remove single quotes.
    if (oldTextContent !== textContent) {
        log.info('Normalized presentation %s', filePath);
        log.verbose(log.colorizeDiff(oldTextContent, textContent));
        (0, file_reader_writer_1.writeFile)(filePath, textContent);
    }
    else {
        log.info('No changes after normalization of the presentation %s', filePath);
    }
}
exports.normalizePresentationFile = normalizePresentationFile;
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
            slides = slides.concat(slidify('note', (0, tex_markdown_converter_1.objectifyTexItemize)(noteContent), {
                source: 'Hefteintrag.tex'
            }));
        }
        const worksheetPath = path_1.default.join(basePath, 'Arbeitsblatt.tex');
        if (fs_1.default.existsSync(worksheetPath)) {
            const worksheetContent = (0, file_reader_writer_1.readFile)(worksheetPath);
            slides = slides.concat(slidify('quote', (0, tex_markdown_converter_1.objectifyTexZitat)(worksheetContent), {
                source: 'Arbeitsblatt.tex'
            }));
        }
        const result = (0, yaml_1.convertToYaml)({
            slides
        });
        log.verbose(result);
        (0, file_reader_writer_1.writeFile)(filePath, result);
    });
}
exports.generatePresentation = generatePresentation;
