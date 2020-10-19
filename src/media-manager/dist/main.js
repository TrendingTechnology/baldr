"use strict";
/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */
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
exports.normalizePresentationFile = exports.loadYaml = exports.fetchFile = exports.moveAsset = exports.yamlToTxt = exports.writeFile = exports.readFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = require("url");
const core_browser_ts_1 = require("@bldr/core-browser-ts");
const titles_1 = require("./titles");
/**
 * Read the content of a text file in the `utf-8` format.
 *
 * A wrapper around `fs.readFileSync()`
 *
 * @param filePath - A path of a text file.
 *
 * @returns The content of the file in the `utf-8` format.
 */
function readFile(filePath) {
    return fs_1.default.readFileSync(filePath, { encoding: 'utf-8' });
}
exports.readFile = readFile;
/**
 * Write some text content into a file.
 *
 * @param filePath - A path of a text file.
 * @param content - Some text to write to a file.
 */
function writeFile(filePath, content) {
    fs_1.default.writeFileSync(filePath, content);
}
exports.writeFile = writeFile;
/**
 * Convert a Javascript object into a text string, ready to be written
 * into a text file. The property names are converted to `snake_case`.
 *
 * @param data - Some data to convert to YAML.
 *
 * @returns A string in the YAML format ready to be written into a text
 *   file. The result string begins with `---`.
 */
function yamlToTxt(data) {
    data = core_browser_ts_1.convertPropertiesCamelToSnake(data);
    const yamlMarkup = [
        '---',
        js_yaml_1.default.safeDump(data, core_browser_ts_1.jsYamlConfig)
    ];
    return yamlMarkup.join('\n');
}
exports.yamlToTxt = yamlToTxt;
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
        const extension = core_browser_ts_1.getExtension(oldPath);
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
 * Load a YAML file. Return only objects to save vscode type checks.
 *
 * @param filePath - The path of a YAML file.
 *
 * @returns The parsed YAML file as a object. The string properties are
 * in the camleCase format.
 */
function loadYaml(filePath) {
    const result = js_yaml_1.default.safeLoad(readFile(filePath));
    if (typeof result !== 'object') {
        return { result };
    }
    return core_browser_ts_1.convertPropertiesSnakeToCamel(result);
}
exports.loadYaml = loadYaml;
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
    let textContent = readFile(filePath);
    const presentation = loadYaml(filePath);
    // Generate meta.
    const title = new titles_1.DeepTitle(filePath);
    const meta = title.generatePresetationMeta();
    if (presentation.meta) {
        if (presentation.meta.id)
            meta.id = presentation.meta.id;
        if (presentation.meta.curriculumUrl)
            meta.curriculumUrl = presentation.meta.curriculumUrl;
    }
    const metaString = yamlToTxt(meta);
    textContent = textContent.replace(/.*\nslides:/, metaString + '\nslides:');
    //
    if (presentation.meta && presentation.meta.id) {
        textContent = shortedMediaUris(textContent, presentation.meta.id);
    }
    // Remove single quotes.
    textContent = removeSingleQuotes(textContent);
    writeFile(filePath, textContent);
}
exports.normalizePresentationFile = normalizePresentationFile;
exports.default = {
    DeepTitle: titles_1.DeepTitle,
    TitleTree: titles_1.TitleTree
};
