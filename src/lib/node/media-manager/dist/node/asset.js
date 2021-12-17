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
exports.convertAsset = exports.initializeMetaYaml = exports.normalizeMediaAsset = exports.renameByRef = exports.renameMediaAsset = exports.moveAsset = void 0;
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Project packages.
const client_media_models_1 = require("@bldr/client-media-models");
const core_browser_1 = require("@bldr/core-browser");
const string_format_1 = require("@bldr/string-format");
const audio_metadata_1 = require("@bldr/audio-metadata");
const media_categories_1 = require("@bldr/media-categories");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const log = __importStar(require("@bldr/log"));
const wikidata_1 = __importDefault(require("@bldr/wikidata"));
const yaml_1 = require("@bldr/yaml");
const media_data_collector_1 = require("@bldr/media-data-collector");
const location_indicator_1 = require("./location-indicator");
const main_1 = require("./main");
const yaml_2 = require("./yaml");
function move(oldPath, newPath, { copy, dryRun }) {
    if (oldPath === newPath) {
        return;
    }
    if (copy != null && copy) {
        if (!(dryRun != null && dryRun)) {
            log.debug('Copy file from %s to %s', [oldPath, newPath]);
            fs_1.default.copyFileSync(oldPath, newPath);
        }
    }
    else {
        if (!(dryRun != null && dryRun)) {
            //  Error: EXDEV: cross-device link not permitted,
            try {
                log.debug('Move file from %s to %s', [oldPath, newPath]);
                fs_1.default.renameSync(oldPath, newPath);
            }
            catch (error) {
                const e = error;
                if (e.code === 'EXDEV') {
                    log.debug('Move file by copying and deleting from %s to %s', [
                        oldPath,
                        newPath
                    ]);
                    fs_1.default.copyFileSync(oldPath, newPath);
                    fs_1.default.unlinkSync(oldPath);
                }
            }
        }
    }
}
/**
 *
 * @param oldParentPath - The old path of the parent media file.
 * @param newParentPath - The new path of the parent media file.
 * @param search - A regular expression the search for a substring that gets replaced by the replaces.
 * @param replaces - An array of replace strings.
 * @param opts
 */
function moveCorrespondingFiles(oldParentPath, newParentPath, search, replaces, opts) {
    for (const replace of replaces) {
        const oldCorrespondingPath = oldParentPath.replace(search, replace);
        if (fs_1.default.existsSync(oldCorrespondingPath)) {
            const newCorrespondingPath = newParentPath.replace(search, replace);
            log.debug('Move corresponding file from %s to %s', [
                oldCorrespondingPath,
                newCorrespondingPath
            ]);
            move(oldCorrespondingPath, newCorrespondingPath, opts);
        }
    }
}
/**
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param oldPath - The old path of a media asset.
 * @param newPath - The new path of a media asset.
 * @param opts - Some options
 *
 * @returns The new path.
 */
function moveAsset(oldPath, newPath, opts = {}) {
    if (newPath != null && oldPath !== newPath) {
        if (!(opts.dryRun != null && opts.dryRun)) {
            fs_1.default.mkdirSync(path_1.default.dirname(newPath), { recursive: true });
        }
        const extension = (0, string_format_1.getExtension)(oldPath);
        if (extension === 'eps' || extension === 'svg') {
            // Dippermouth-Blues.eps
            // Dippermouth-Blues.mscx
            // Dippermouth-Blues-eps-converted-to.pdf
            moveCorrespondingFiles(oldPath, newPath, /\.(eps|svg)$/, ['.mscx', '-eps-converted-to.pdf', '.eps', '.svg'], opts);
        }
        // Beethoven.mp4
        // Beethoven.mp4.yml
        // Beethoven.mp4_preview.jpg
        // Beethoven.mp4_waveform.png
        for (const suffix of ['.yml', '_preview.jpg', '_waveform.png']) {
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
 * Rename a media asset and its meta data files.
 *
 * @param oldPath - The media file path.
 *
 * @returns The new file name.
 */
function renameMediaAsset(oldPath) {
    let metaData;
    if (fs_1.default.existsSync(`${oldPath}.yml`)) {
        metaData = (0, media_data_collector_1.buildMinimalAssetData)(oldPath);
    }
    let newPath;
    if ((metaData === null || metaData === void 0 ? void 0 : metaData.categories) != null) {
        metaData.extension = (0, string_format_1.getExtension)(oldPath);
        metaData.filePath = oldPath;
        const d = metaData;
        newPath = media_categories_1.categoriesManagement.formatFilePath(d, oldPath);
    }
    if (newPath == null) {
        newPath = (0, core_browser_1.asciify)(oldPath);
    }
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
 * Rename a media asset after the `ref` (reference) property in the metadata file.
 *
 * @param filePath - The media asset file path.
 */
function renameByRef(filePath) {
    let result;
    try {
        result = (0, main_1.readYamlMetaData)(filePath);
    }
    catch (error) {
        log.errorAny(error);
        return;
    }
    if (result.ref != null) {
        let ref = result.ref;
        const oldPath = filePath;
        const refs = location_indicator_1.locationIndicator.getRefOfSegments(filePath);
        // 10_Ausstellung-Ueberblick/NB/01_Gnom.svg.yml
        // ref: Ausstellung-Ueberblick_NB_01_Gnom
        // -> 01_Gnom
        // 10_Ausstellung-Ueberblick/YT/sPg1qlLjUVQ.mp4.yml
        // ref: YT_sPg1qlLjUVQ
        // -> sPg1qlLjUVQ
        if (refs != null) {
            for (const pathRef of refs) {
                ref = ref.replace(new RegExp(`^${pathRef}_`), '');
            }
        }
        // Old approach:
        // ref = ref.replace(new RegExp('.*_' + getTwoLetterRegExp() + '_'), '')
        // .mp4
        const extension = path_1.default.extname(oldPath);
        const oldBaseName = path_1.default.basename(oldPath, extension);
        let newPath = null;
        if (ref === oldBaseName) {
            return;
        }
        log.info('Rename the file %s by reference from %s to %s', [
            filePath,
            oldBaseName,
            ref
        ]);
        newPath = path_1.default.join(path_1.default.dirname(oldPath), `${ref}${extension}`);
        moveAsset(oldPath, newPath);
    }
}
exports.renameByRef = renameByRef;
function queryWikidata(metaData, categoryNames, categoryCollection) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataWiki = yield wikidata_1.default.query(metaData.wikidata, categoryNames, categoryCollection);
        log.verboseAny(dataWiki);
        metaData = wikidata_1.default.mergeData(metaData, dataWiki, categoryCollection);
        // To avoid blocking
        // url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q16276296&format=json&languages=en%7Cde&props=labels',
        // status: 429,
        // statusText: 'Scripted requests from your IP have been blocked, please
        // contact noc@wikimedia.org, and see also https://meta.wikimedia.org/wiki/User-Agent_policy',
        (0, core_browser_1.msleep)(3000);
        return metaData;
    });
}
function logDiff(oldYamlMarkup, newYamlMarkup) {
    log.verbose(log.colorizeDiff(oldYamlMarkup, newYamlMarkup));
}
/**
 * Normalize a media asset file.
 *
 * @param filePath - The media asset file path.
 */
function normalizeMediaAsset(filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const yamlFile = `${filePath}.yml`;
            const raw = (0, media_data_collector_1.buildMinimalAssetData)(filePath);
            if (raw != null) {
                raw.filePath = filePath;
            }
            let metaData = raw;
            if (metaData == null) {
                return;
            }
            const origData = (0, core_browser_1.deepCopy)(metaData);
            // Always: general
            const categoryNames = media_categories_1.categoriesManagement.detectCategoryByPath(filePath);
            if (categoryNames != null) {
                const categories = metaData.categories != null ? metaData.categories : '';
                metaData.categories = media_categories_1.categoriesManagement.mergeNames(categories, categoryNames);
            }
            if ((options === null || options === void 0 ? void 0 : options.wikidata) != null) {
                if (metaData.wikidata != null && metaData.categories != null) {
                    metaData = yield queryWikidata(metaData, metaData.categories, media_categories_1.categories);
                }
            }
            const newMetaData = yield media_categories_1.categoriesManagement.process(metaData, filePath);
            const oldMetaData = origData;
            delete oldMetaData.filePath;
            const oldYamlMarkup = (0, yaml_1.convertToYaml)(oldMetaData);
            const newYamlMarkup = (0, yaml_1.convertToYaml)(newMetaData);
            if (oldYamlMarkup !== newYamlMarkup) {
                logDiff(oldYamlMarkup, newYamlMarkup);
                (0, file_reader_writer_1.writeYamlFile)(yamlFile, newMetaData);
            }
        }
        catch (error) {
            log.error(filePath);
            log.errorAny(error);
            process.exit();
        }
    });
}
exports.normalizeMediaAsset = normalizeMediaAsset;
/**
 * Rename, create metadata yaml and normalize the metadata file.
 */
function initializeMetaYaml(filePath, metaData) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPath = renameMediaAsset(filePath);
        yield (0, yaml_2.writeYamlMetaData)(newPath, metaData);
        yield normalizeMediaAsset(newPath, { wikidata: false });
    });
}
exports.initializeMetaYaml = initializeMetaYaml;
/**
 * A set of output file paths. To avoid duplicate rendering by a second
 * run of the script.
 *
 * First run: `01 Hintergrund.MP3` -> `01-Hintergrund.m4a`
 *
 * Second run:
 * - not:
 *   1. `01 Hintergrund.MP3` -> `01-Hintergrund.m4a`
 *   2. `01-Hintergrund.m4a` -> `01-Hintergrund.m4a` (bad)
 * - but:
 *   1. `01 Hintergrund.MP3` -> `01-Hintergrund.m4a`
 */
const converted = new Set();
/**
 * Convert a media asset file.
 *
 * @param filePath - The path of the input file.
 * @param cmdObj - The command object from the commander.
 *
 * @returns The output file path.
 */
function convertAsset(filePath, cmdObj = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const asset = (0, media_data_collector_1.buildMinimalAssetData)(filePath);
        if (asset.mimeType == null) {
            return;
        }
        const outputExtension = client_media_models_1.mimeTypeManager.typeToTargetExtension(asset.mimeType);
        const outputFileName = `${(0, core_browser_1.referencify)(asset.basename)}.${outputExtension}`;
        let outputFile = path_1.default.join(path_1.default.dirname(filePath), outputFileName);
        if (converted.has(outputFile))
            return;
        let process;
        // audio
        // https://trac.ffmpeg.org/wiki/Encode/AAC
        // ffmpeg aac encoder
        // '-c:a', 'aac', '-b:a', '128k',
        // aac_he
        // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he','-b:a', '64k',
        // aac_he_v2
        // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2'
        if (asset.mimeType === 'audio') {
            process = child_process_1.default.spawnSync('ffmpeg', [
                '-i',
                filePath,
                // '-c:a', 'aac', '-b:a', '128k',
                // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he', '-b:a', '64k',
                '-c:a',
                'libfdk_aac',
                '-vbr',
                '2',
                // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2',
                '-vn',
                '-map_metadata',
                '-1',
                '-y',
                outputFile
            ]);
            // image
        }
        else if (asset.mimeType === 'image') {
            let size = '2000x2000>';
            if (cmdObj.previewImage != null) {
                outputFile = filePath.replace(`.${asset.extension}`, '_preview.jpg');
                size = '1000x1000>';
            }
            process = child_process_1.default.spawnSync('magick', [
                'convert',
                filePath,
                '-resize',
                size,
                '-quality',
                '60',
                outputFile
            ]);
            // videos
        }
        else if (asset.mimeType === 'video') {
            process = child_process_1.default.spawnSync('ffmpeg', [
                '-i',
                filePath,
                '-vcodec',
                'libx264',
                '-profile:v',
                'baseline',
                '-y',
                outputFile
            ]);
        }
        if (process != null) {
            if (process.status !== 0 && asset.mimeType === 'audio') {
                // A second attempt for mono audio: HEv2 only makes sense with stereo.
                // see http://www.ffmpeg-archive.org/stereo-downmix-error-aac-HEv2-td4664367.html
                process = child_process_1.default.spawnSync('ffmpeg', [
                    '-i',
                    filePath,
                    '-c:a',
                    'libfdk_aac',
                    '-profile:a',
                    'aac_he',
                    '-b:a',
                    '64k',
                    '-vn',
                    '-map_metadata',
                    '-1',
                    '-y',
                    outputFile
                ]);
            }
            if (process.status === 0) {
                if (asset.mimeType === 'audio') {
                    let metaData;
                    try {
                        metaData = (yield (0, audio_metadata_1.collectAudioMetadata)(filePath));
                    }
                    catch (error) {
                        log.errorAny(error);
                    }
                    if (metaData != null) {
                        yield (0, yaml_2.writeYamlMetaData)(outputFile, metaData);
                    }
                }
                converted.add(outputFile);
            }
            else {
                log.error(process.stdout.toString());
                log.error(process.stderr.toString());
                throw new Error(`ConvertError: ${filePath} -> ${outputFile}`);
            }
        }
        return outputFile;
    });
}
exports.convertAsset = convertAsset;
