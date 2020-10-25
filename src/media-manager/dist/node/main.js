"use strict";
/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
exports.normalizePresentationFile = exports.renameMediaAsset = exports.readAssetYaml = exports.fetchFile = exports.moveAsset = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const node_fetch_1 = __importDefault(require("node-fetch"));
const core_browser_1 = require("@bldr/core-browser");
const titles_1 = require("./titles");
const yaml_1 = require("./yaml");
const file_1 = require("./file");
const meta_types_1 = __importDefault(require("./meta-types"));
const helper_1 = require("./helper");
__exportStar(require("./yaml"), exports);
/**
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param oldPath - The old path of a media asset.
 * @param newPath - The new path of a media asset.
 * @param opts - Some options
 */
function moveAsset(oldPath, newPath, opts = {}) {
    function move(oldPath, newPath, { copy, dryRun }) {
        if (copy) {
            if (!dryRun)
                fs_1.default.copyFileSync(oldPath, newPath);
        }
        else {
            if (!dryRun) {
                //  Error: EXDEV: cross-device link not permitted,
                try {
                    fs_1.default.renameSync(oldPath, newPath);
                }
                catch (error) {
                    if (error.code === 'EXDEV') {
                        fs_1.default.copyFileSync(oldPath, newPath);
                        fs_1.default.unlinkSync(oldPath);
                    }
                }
            }
        }
    }
    function moveCorrespondingFile(oldPath, newPath, search, replace, opts) {
        oldPath = oldPath.replace(search, replace);
        if (fs_1.default.existsSync(oldPath)) {
            newPath = newPath.replace(search, replace);
            move(oldPath, newPath, opts);
        }
    }
    if (newPath && oldPath !== newPath) {
        if (!opts.dryRun)
            fs_1.default.mkdirSync(path_1.default.dirname(newPath), { recursive: true });
        const extension = core_browser_1.getExtension(oldPath);
        if (extension === 'eps') {
            // Dippermouth-Blues.eps
            // Dippermouth-Blues.mscx
            moveCorrespondingFile(oldPath, newPath, /\.eps$/, '.mscx', opts);
            // Dippermouth-Blues-eps-converted-to.pdf
            moveCorrespondingFile(oldPath, newPath, /\.eps$/, '-eps-converted-to.pdf', opts);
        }
        // Beethoven.mp4 Beethoven.mp4.yml Beethoven.mp4_preview.jpg
        for (const suffix of ['.yml', '_preview.jpg']) {
            if (fs_1.default.existsSync(`${oldPath}${suffix}`)) {
                move(`${oldPath}${suffix}`, `${newPath}${suffix}`, opts);
            }
        }
        move(oldPath, newPath, opts);
        return newPath;
    }
}
exports.moveAsset = moveAsset;
/**
 * Download a URL to a destination.
 *
 * @param url - The URL.
 * @param dest - The destination. Missing parent directories are
 *   automatically created.
 */
function fetchFile(url, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield node_fetch_1.default(new url_1.URL(url));
        fs_1.default.mkdirSync(path_1.default.dirname(dest), { recursive: true });
        fs_1.default.writeFileSync(dest, Buffer.from(yield response.arrayBuffer()));
    });
}
exports.fetchFile = fetchFile;
/**
 * Read the corresponding YAML file of a media asset.
 *
 * @param filePath - The path of the media asset (without the
 *   extension `.yml`).
 */
function readAssetYaml(filePath) {
    const extension = core_browser_1.getExtension(filePath);
    if (extension !== 'yml')
        filePath = `${filePath}.yml`;
    if (fs_1.default.existsSync(filePath)) {
        return yaml_1.loadYaml(filePath);
    }
}
exports.readAssetYaml = readAssetYaml;
/**
 * Rename a media asset and its meta data files.
 *
 * @param oldPath - The media file path.
 *
 * @returns The new file name.
 */
function renameMediaAsset(oldPath) {
    const metaData = readAssetYaml(oldPath);
    let newPath;
    if (metaData && metaData.metaTypes) {
        metaData.extension = core_browser_1.getExtension(oldPath);
        newPath = meta_types_1.default.formatFilePath(metaData, oldPath);
    }
    if (!newPath)
        newPath = helper_1.asciify(oldPath);
    const basename = path_1.default.basename(newPath);
    // Remove a- and v- prefixes
    const cleanedBasename = basename.replace(/^[va]-/g, '');
    if (cleanedBasename !== basename) {
        newPath = path_1.default.join(path_1.default.dirname(newPath), cleanedBasename);
    }
    moveAsset(oldPath, newPath);
    return newPath;
}
exports.renameMediaAsset = renameMediaAsset;
/**
 * Remove unnecessary single quotes.
 *
 * js-yaml add single quotes arround the media URIs, for example
 * `'id:fuer-elise'`.
 *
 * @param rawYamlString - A raw YAML string (not converted into a
 *   Javascript object).
 *
 * @returns A raw YAML string without single quotes around the media
 *   URIs.
 */
function removeSingleQuotes(rawYamlString) {
    return rawYamlString.replace(/ 'id:([^']*)'/g, ' id:$1');
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
    return rawYamlString.replace(new RegExp(`id:${presentationId}_`, 'g'), 'id:./');
}
/**
 * Normalize a presentation file.
 *
 * Remove unnecessary single quotes around media URIs.
 *
 * @param filePath - A path of a text file.
 */
function normalizePresentationFile(filePath) {
    let textContent = file_1.readFile(filePath);
    const presentation = yaml_1.loadYaml(filePath);
    // Generate meta.
    const title = new titles_1.DeepTitle(filePath);
    const meta = title.generatePresetationMeta();
    if (presentation.meta) {
        if (presentation.meta.id)
            meta.id = presentation.meta.id;
        if (presentation.meta.curriculumUrl)
            meta.curriculumUrl = presentation.meta.curriculumUrl;
    }
    const metaString = yaml_1.yamlToTxt({ meta });
    textContent = textContent.replace(/.*\nslides:/s, metaString + '\nslides:');
    // Shorten media URIs with `./`
    if (meta.id) {
        textContent = shortedMediaUris(textContent, meta.id);
    }
    // Remove single quotes.
    textContent = removeSingleQuotes(textContent);
    file_1.writeFile(filePath, textContent);
    console.log(textContent);
}
exports.normalizePresentationFile = normalizePresentationFile;
exports.default = {
    DeepTitle: titles_1.DeepTitle,
    TitleTree: titles_1.TitleTree
};
