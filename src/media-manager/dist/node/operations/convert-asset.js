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
exports.convertAsset = void 0;
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
// Third party packages.
const music_metadata_1 = __importDefault(require("music-metadata"));
const media_file_classes_1 = require("../media-file-classes");
const yaml_1 = require("../yaml");
const helper_1 = require("../helper");
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
 *
 * @type {Set}
 */
const converted = new Set();
/**
 * Output from `music-metadata`:
 *
 * ```js
 * {
 *   format: {
 *     tagTypes: [ 'ID3v2.3', 'ID3v1' ],
 *     lossless: false,
 *     container: 'MPEG',
 *     codec: 'MP3',
 *     sampleRate: 44100,
 *     numberOfChannels: 2,
 *     bitrate: 192000,
 *     codecProfile: 'CBR',
 *     numberOfSamples: 18365184,
 *     duration: 416.4440816326531
 *   },
 *   native: undefined,
 *   quality: { warnings: [] },
 *   common: {
 *     track: { no: 2, of: 7 },
 *     disk: { no: 1, of: 1 },
 *     title: 'Symphonie fantastique, Op. 14: II. Un bal',
 *     artists: [ 'Hector Berlioz' ],
 *     artist: 'Hector Berlioz',
 *     album: 'Symphonie fantastique / Lélio',
 *     media: 'CD',
 *     originalyear: 1998,
 *     year: 1998,
 *     label: [ 'BMG Classics' ],
 *     artistsort: 'Berlioz, Hector',
 *     asin: 'B000006OPB',
 *     barcode: '090266893027',
 *     musicbrainz_recordingid: 'ca3b02af-b6be-4f95-8217-31126b2c2b67',
 *     catalognumber: [ '09026-68930-2' ],
 *     releasetype: [ 'album' ],
 *     releasecountry: 'US',
 *     acoustid_id: 'ed58118e-3b76-492b-9453-223d0ca72b86',
 *     musicbrainz_albumid: '986209e3-ce80-4b66-af78-22a035dde993',
 *     musicbrainz_artistid: [ '274774a7-1cde-486a-bc3d-375ec54d552d' ],
 *     albumartist: 'Berlioz; San Francisco Symphony & Chorus, Michael Tilson Thomas',
 *     musicbrainz_releasegroupid: '3a7e05b9-14fd-3cff-ac29-e568dd10a2a9',
 *     musicbrainz_trackid: 'c90eaa1c-2be5-4eba-a37e-fa3d1dfb0882',
 *     albumartistsort: 'Berlioz, Hector; San Francisco Symphony & San Francisco Symphony Chorus, Tilson Thomas, Michael',
 *     musicbrainz_albumartistid: [
 *       '274774a7-1cde-486a-bc3d-375ec54d552d',
 *       'deebc49a-6e06-418e-860f-8c7f770a8bac',
 *       '568d7c51-0573-4c65-9211-65bf8c8470c7',
 *       'f6df125a-a83c-4161-8cbe-48f4a3a7cad5'
 *     ],
 *     picture: [ [Object] ]
 *   }
 * }
 * ```
 */
function collectMusicMetaData(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const metaData = yield music_metadata_1.default.parseFile(filePath);
        if ('common' in metaData) {
            const output = {};
            const common = metaData.common;
            for (const property of [
                ['title', 'title'],
                ['albumartist', 'artist'],
                ['artist', 'composer'],
                ['album', 'album'],
                ['musicbrainz_recordingid', 'musicbrainz_recording_id']
            ]) {
                if (property[0] in common && common[property[0]]) {
                    output[property[1]] = common[property[0]];
                }
            }
            if (output.album && output.title) {
                output.title = `${output.album}: ${output.title}`;
                delete output.album;
            }
            return output;
        }
    });
}
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
        const asset = media_file_classes_1.makeAsset(filePath);
        if (!asset.extension) {
            return;
        }
        let assetType;
        try {
            assetType = media_file_classes_1.mediaCategoriesManager.extensionToType(asset.extension);
        }
        catch (error) {
            console.log(`Unsupported extension ${asset.extension}`);
            return;
        }
        const outputExtension = media_file_classes_1.mediaCategoriesManager.typeToTargetExtension(assetType);
        const outputFileName = `${helper_1.idify(asset.basename)}.${outputExtension}`;
        let outputFile = path_1.default.join(path_1.default.dirname(filePath), outputFileName);
        if (converted.has(outputFile))
            return;
        let process = undefined;
        // audio
        // https://trac.ffmpeg.org/wiki/Encode/AAC
        // ffmpeg aac encoder
        // '-c:a', 'aac', '-b:a', '128k',
        // aac_he
        // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he','-b:a', '64k',
        // aac_he_v2
        // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2'
        if (assetType === 'audio') {
            process = child_process_1.default.spawnSync('ffmpeg', [
                '-i', filePath,
                // '-c:a', 'aac', '-b:a', '128k',
                // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he', '-b:a', '64k',
                '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2',
                '-vn',
                '-map_metadata', '-1',
                '-y',
                outputFile
            ]);
            // image
        }
        else if (assetType === 'image') {
            let size = '2000x2000>';
            if (cmdObj.previewImage) {
                outputFile = filePath.replace(`.${asset.extension}`, '_preview.jpg');
                size = '1000x1000>';
            }
            process = child_process_1.default.spawnSync('magick', [
                'convert',
                filePath,
                '-resize', size,
                '-quality', '60',
                outputFile
            ]);
            // videos
        }
        else if (assetType === 'video') {
            process = child_process_1.default.spawnSync('ffmpeg', [
                '-i', filePath,
                '-vcodec', 'libx264',
                '-profile:v', 'baseline',
                '-y',
                outputFile
            ]);
        }
        if (process) {
            if (process.status !== 0 && assetType === 'audio') {
                // A second attempt for mono audio: HEv2 only makes sense with stereo.
                // see http://www.ffmpeg-archive.org/stereo-downmix-error-aac-HEv2-td4664367.html
                process = child_process_1.default.spawnSync('ffmpeg', [
                    '-i', filePath,
                    '-c:a', 'libfdk_aac', '-profile:a', 'aac_he', '-b:a', '64k',
                    '-vn',
                    '-map_metadata', '-1',
                    '-y',
                    outputFile
                ]);
            }
            if (process.status === 0) {
                if (assetType === 'audio') {
                    const metaData = yield collectMusicMetaData(filePath);
                    if (metaData) {
                        yaml_1.writeMetaDataYaml(outputFile, metaData);
                    }
                }
                converted.add(outputFile);
            }
            else {
                console.log(process.stdout.toString());
                console.log(process.stderr.toString());
                throw new Error(`ConvertError: ${filePath} -> ${outputFile}`);
            }
        }
        return outputFile;
    });
}
exports.convertAsset = convertAsset;
