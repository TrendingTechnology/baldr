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
// Project packages.
const fs_1 = __importDefault(require("fs"));
const log = __importStar(require("@bldr/log"));
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const core_node_1 = require("@bldr/core-node");
const cli_utils_1 = require("@bldr/cli-utils");
const media_manager_1 = require("@bldr/media-manager");
const audio_metadata_1 = require("@bldr/audio-metadata");
const cmd = new cli_utils_1.CommandRunner({ verbose: true });
const WAVEFORM_DEFAULT_HEIGHT = 500;
const WAVEFORM_DEFAULT_WIDTH = 1000;
// width = duration * factor
const WAVEFORM_WIDTH_FACTOR = 20;
function createAudioWaveForm(srcPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const meta = yield audio_metadata_1.collectAudioMetadata(srcPath);
        let width = `${WAVEFORM_DEFAULT_WIDTH}`;
        if ((meta === null || meta === void 0 ? void 0 : meta.duration) != null) {
            width = (meta.duration * WAVEFORM_WIDTH_FACTOR).toFixed(0);
        }
        const destPath = `${srcPath}_waveform.png`;
        cmd.execSync([
            'ffmpeg',
            // '-t', '60',
            '-i',
            srcPath,
            '-filter_complex',
            `aformat=channel_layouts=mono,compand,showwavespic=size=${width}x${WAVEFORM_DEFAULT_HEIGHT}:colors=black`,
            '-frames:v',
            '1',
            '-y',
            destPath
        ]);
        log.verbose('Create waveform image %s from %s.', [destPath, srcPath]);
    });
}
function downloadAudioCoverImage(srcPath, destPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const yamlFile = `${srcPath}.yml`;
        const metaData = file_reader_writer_1.readYamlFile(yamlFile);
        if (metaData.coverSource != null) {
            yield core_node_1.fetchFile(metaData.coverSource, destPath);
            log.verbose('Download preview image %s from %s.', [
                destPath,
                metaData.coverSource
            ]);
        }
        else {
            log.error('No property “cover_source” found.');
        }
    });
}
function extractAudioCoverFromMetadata(srcPath, destPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(destPath)) {
            yield audio_metadata_1.extractCoverImage(srcPath, destPath);
        }
    });
}
/**
 * Create a video preview image.
 */
function extractFrameFromVideo(srcPath, destPath, second = 10) {
    let secondString;
    if (typeof second === 'number') {
        secondString = second.toString();
    }
    else {
        secondString = second;
    }
    cmd.execSync([
        'ffmpeg',
        '-i',
        srcPath,
        '-ss',
        secondString,
        '-vframes',
        '1',
        '-qscale:v',
        '10',
        '-y',
        destPath
    ]);
    log.verbose('Create preview image %s of a video file.', [destPath]);
}
function convertFirstPdfPageToJpg(srcPath, destPath) {
    destPath = destPath.replace('.jpg', '');
    cmd.execSync([
        'pdftocairo',
        '-jpeg',
        '-jpegopt',
        'quality=30,optimize=y',
        '-singlefile',
        '-scale-to',
        '500',
        srcPath,
        destPath
    ]);
    log.verbose('Create preview image %s of a PDF file.', [destPath]);
}
function createPreviewOneFile(srcPath, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        log.info('Create preview files for %s', [srcPath]);
        const mimeType = media_manager_1.filePathToMimeType(srcPath);
        log.debug('The MIME type of the file is %s', [mimeType]);
        const destPathPreview = `${srcPath}_preview.jpg`;
        const destPathWavefrom = `${srcPath}_waveform.png`;
        if (mimeType === 'audio' &&
            (!fs_1.default.existsSync(destPathWavefrom) || (cmdObj === null || cmdObj === void 0 ? void 0 : cmdObj.force))) {
            yield createAudioWaveForm(srcPath);
        }
        if (fs_1.default.existsSync(destPathPreview) && !cmdObj.force) {
            return;
        }
        if (mimeType === 'video') {
            extractFrameFromVideo(srcPath, destPathPreview, cmdObj.seconds);
        }
        else if (mimeType === 'document') {
            convertFirstPdfPageToJpg(srcPath, destPathPreview);
        }
        else if (mimeType === 'audio') {
            yield downloadAudioCoverImage(srcPath, destPathPreview);
            yield extractAudioCoverFromMetadata(srcPath, destPathPreview);
        }
    });
}
/**
 * Create preview images.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(filePaths, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        yield media_manager_1.walk({
            asset(relPath) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield createPreviewOneFile(relPath, cmdObj);
                });
            }
        }, {
            path: filePaths
        });
    });
}
module.exports = action;
