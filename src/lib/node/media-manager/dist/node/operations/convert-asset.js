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
// Project packages.
const audio_metadata_1 = __importDefault(require("@bldr/audio-metadata"));
const media_file_classes_1 = require("../media-file-classes");
const yaml_1 = require("../yaml");
const core_browser_1 = require("@bldr/core-browser");
const client_media_models_1 = require("@bldr/client-media-models");
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
        const asset = media_file_classes_1.makeAsset(filePath);
        if (asset.extension == null) {
            return;
        }
        let mimeType;
        try {
            mimeType = client_media_models_1.mimeTypeManager.extensionToType(asset.extension);
        }
        catch (error) {
            console.log(`Unsupported extension ${asset.extension}`);
            return;
        }
        const outputExtension = client_media_models_1.mimeTypeManager.typeToTargetExtension(mimeType);
        const outputFileName = `${core_browser_1.idify(asset.basename)}.${outputExtension}`;
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
        if (mimeType === 'audio') {
            process = child_process_1.default.spawnSync('ffmpeg', [
                '-i', filePath,
                // '-c:a', 'aac', '-b:a', '128k',
                // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he', '-b:a', '64k',
                '-c:a', 'libfdk_aac', '-vbr', '2',
                // '-c:a', 'libfdk_aac', '-profile:a', 'aac_he_v2',
                '-vn',
                '-map_metadata', '-1',
                '-y',
                outputFile
            ]);
            // image
        }
        else if (mimeType === 'image') {
            let size = '2000x2000>';
            if (cmdObj.previewImage != null) {
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
        else if (mimeType === 'video') {
            process = child_process_1.default.spawnSync('ffmpeg', [
                '-i', filePath,
                '-vcodec', 'libx264',
                '-profile:v', 'baseline',
                '-y',
                outputFile
            ]);
        }
        if (process != null) {
            if (process.status !== 0 && mimeType === 'audio') {
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
                if (mimeType === 'audio') {
                    let metaData;
                    try {
                        metaData = (yield audio_metadata_1.default(filePath));
                    }
                    catch (error) {
                        console.log(error);
                    }
                    if (metaData != null) {
                        yaml_1.writeYamlMetaData(outputFile, metaData);
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
