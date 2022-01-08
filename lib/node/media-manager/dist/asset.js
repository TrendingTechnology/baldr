var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import childProcess from 'child_process';
import path from 'path';
import fs from 'fs';
// Project packages.
import { mimeTypeManager } from '@bldr/client-media-models';
import { deepCopy, msleep } from '@bldr/core-browser';
import { getExtension, referencify, asciify } from '@bldr/string-format';
import { collectAudioMetadata } from '@bldr/audio-metadata';
import { categoriesManagement, categories } from '@bldr/media-categories';
import { writeYamlFile } from '@bldr/file-reader-writer';
import * as log from '@bldr/log';
import * as wikidata from '@bldr/wikidata';
import { convertToYaml } from '@bldr/yaml';
import { buildMinimalAssetData } from '@bldr/media-data-collector';
import { locationIndicator } from './location-indicator';
import { readYamlMetaData } from './main';
import { writeYamlMetaData } from './yaml';
function getReferenceFromFilePath(filePath) {
    const basename = path.basename(filePath, '.' + getExtension(filePath));
    return referencify(basename);
}
function move(oldPath, newPath, { copy, dryRun }) {
    if (oldPath === newPath) {
        return;
    }
    if (copy != null && copy) {
        if (!(dryRun != null && dryRun)) {
            log.debug('Copy file from %s to %s', [oldPath, newPath]);
            fs.copyFileSync(oldPath, newPath);
        }
    }
    else {
        if (!(dryRun != null && dryRun)) {
            //  Error: EXDEV: cross-device link not permitted,
            try {
                log.debug('Move file from %s to %s', [oldPath, newPath]);
                fs.renameSync(oldPath, newPath);
            }
            catch (error) {
                const e = error;
                if (e.code === 'EXDEV') {
                    log.debug('Move file by copying and deleting from %s to %s', [
                        oldPath,
                        newPath
                    ]);
                    fs.copyFileSync(oldPath, newPath);
                    fs.unlinkSync(oldPath);
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
        if (fs.existsSync(oldCorrespondingPath)) {
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
export function moveAsset(oldPath, newPath, opts = {}) {
    if (newPath != null && oldPath !== newPath) {
        if (!(opts.dryRun != null && opts.dryRun)) {
            fs.mkdirSync(path.dirname(newPath), { recursive: true });
        }
        const extension = getExtension(oldPath);
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
            if (fs.existsSync(`${oldPath}${suffix}`)) {
                move(`${oldPath}${suffix}`, `${newPath}${suffix}`, opts);
            }
        }
        move(oldPath, newPath, opts);
        return newPath;
    }
}
/**
 * Rename a media asset and its meta data files.
 *
 * @param oldPath - The media file path.
 *
 * @returns The new file name.
 */
export function renameMediaAsset(oldPath) {
    let metaData;
    if (fs.existsSync(`${oldPath}.yml`)) {
        metaData = buildMinimalAssetData(oldPath);
    }
    let newPath;
    if ((metaData === null || metaData === void 0 ? void 0 : metaData.categories) != null) {
        metaData.extension = getExtension(oldPath);
        metaData.filePath = oldPath;
        const d = metaData;
        newPath = categoriesManagement.formatFilePath(d, oldPath);
    }
    if (newPath == null) {
        newPath = asciify(oldPath);
    }
    const basename = path.basename(newPath);
    // Remove a- and v- prefixes
    const cleanedBasename = basename.replace(/^[va]-/g, '');
    if (cleanedBasename !== basename) {
        newPath = path.join(path.dirname(newPath), cleanedBasename);
    }
    moveAsset(oldPath, newPath);
    return newPath;
}
/**
 * Rename a media asset after the `ref` (reference) property in the metadata file.
 *
 * @param filePath - The media asset file path.
 */
export function renameByRef(filePath) {
    let result;
    try {
        result = readYamlMetaData(filePath);
    }
    catch (error) {
        log.errorAny(error);
        return;
    }
    if (result.ref != null) {
        let ref = result.ref;
        const oldPath = filePath;
        const refs = locationIndicator.getRefOfSegments(filePath);
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
        const extension = path.extname(oldPath);
        const oldBaseName = path.basename(oldPath, extension);
        let newPath = null;
        if (ref === oldBaseName) {
            return;
        }
        log.info('Rename the file %s by reference from %s to %s', [
            filePath,
            oldBaseName,
            ref
        ]);
        newPath = path.join(path.dirname(oldPath), `${ref}${extension}`);
        moveAsset(oldPath, newPath);
    }
}
function queryWikidata(metaData, categoryNames, categoryCollection) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataWiki = yield wikidata.query(metaData.wikidata, categoryNames, categoryCollection);
        log.verboseAny(dataWiki);
        metaData = wikidata.mergeData(metaData, dataWiki, categoryCollection);
        // To avoid blocking
        // url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q16276296&format=json&languages=en%7Cde&props=labels',
        // status: 429,
        // statusText: 'Scripted requests from your IP have been blocked, please
        // contact noc@wikimedia.org, and see also https://meta.wikimedia.org/wiki/User-Agent_policy',
        msleep(3000);
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
export function normalizeMediaAsset(filePath, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const yamlFile = `${filePath}.yml`;
            const raw = buildMinimalAssetData(filePath);
            if (raw != null) {
                raw.filePath = filePath;
            }
            let metaData = raw;
            if (metaData == null) {
                return;
            }
            const origData = deepCopy(metaData);
            // Always: general
            const categoryNames = categoriesManagement.detectCategoryByPath(filePath);
            if (categoryNames != null) {
                const categories = metaData.categories != null ? metaData.categories : '';
                metaData.categories = categoriesManagement.mergeNames(categories, categoryNames);
            }
            if ((options === null || options === void 0 ? void 0 : options.wikidata) != null) {
                if (metaData.wikidata != null && metaData.categories != null) {
                    metaData = yield queryWikidata(metaData, metaData.categories, categories);
                }
            }
            const newMetaData = yield categoriesManagement.process(metaData, filePath);
            const oldMetaData = origData;
            delete oldMetaData.filePath;
            const oldYamlMarkup = convertToYaml(oldMetaData);
            const newYamlMarkup = convertToYaml(newMetaData);
            if (oldYamlMarkup !== newYamlMarkup) {
                logDiff(oldYamlMarkup, newYamlMarkup);
                writeYamlFile(yamlFile, newMetaData);
            }
        }
        catch (error) {
            log.error(filePath);
            log.errorAny(error);
            process.exit();
        }
    });
}
/**
 * Rename, create metadata yaml and normalize the metadata file.
 */
export function initializeMetaYaml(filePath, metaData) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPath = renameMediaAsset(filePath);
        yield writeYamlMetaData(newPath, metaData);
        yield normalizeMediaAsset(newPath, { wikidata: false });
    });
}
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
export function convertAsset(filePath, cmdObj = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const extension = getExtension(filePath);
        const mimeType = mimeTypeManager.filePathToType(filePath);
        const outputExtension = mimeTypeManager.typeToTargetExtension(mimeType);
        const reference = getReferenceFromFilePath(filePath);
        const outputFileName = `${reference}.${outputExtension}`;
        let outputFile = path.join(path.dirname(filePath), outputFileName);
        if (converted.has(outputFile)) {
            return;
        }
        let process;
        // audio
        // https://trac.ffmpeg.org/wiki/Encode/AAC
        // ffmpeg aac encoder
        // '-c:a', 'aac', '-b:a', '128k',
        // aac_he
        // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he','-b:a', '64k',
        // aac_he_v2
        // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2'
        if (mimeType === 'audio') {
            process = childProcess.spawnSync('ffmpeg', [
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
        else if (mimeType === 'image') {
            let size = '2000x2000>';
            if (cmdObj.hasPreview != null) {
                outputFile = filePath.replace(`.${extension}`, '_preview.jpg');
                size = '1000x1000>';
            }
            process = childProcess.spawnSync('magick', [
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
        else if (mimeType === 'video') {
            process = childProcess.spawnSync('ffmpeg', [
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
            if (process.status !== 0 && mimeType === 'audio') {
                // A second attempt for mono audio: HEv2 only makes sense with stereo.
                // see http://www.ffmpeg-archive.org/stereo-downmix-error-aac-HEv2-td4664367.html
                process = childProcess.spawnSync('ffmpeg', [
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
                if (mimeType === 'audio') {
                    let metaData;
                    try {
                        metaData = (yield collectAudioMetadata(filePath));
                    }
                    catch (error) {
                        log.errorAny(error);
                    }
                    if (metaData != null) {
                        yield writeYamlMetaData(outputFile, metaData);
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
