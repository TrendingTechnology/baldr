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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = __importDefault(require("child_process"));
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const presentation_parser_1 = require("@bldr/presentation-parser");
const media_manager_1 = require("@bldr/media-manager");
const log = __importStar(require("@bldr/log"));
function requestYoutubeApi(youtubeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const snippet = yield presentation_parser_1.youtubeMModule.getSnippet(youtubeId);
        if (snippet != null) {
            return {
                youtubeId,
                originalHeading: snippet.title,
                originalInfo: snippet.description
            };
        }
    });
}
function parseYoutubeDlProgressStdOut(cmd, stdout) {
    var _a, _b, _c, _d;
    // [download]   2.9% of 118.39MiB at 82.11KiB/s ETA 23:53
    // [download]  66.8% of 118.39MiB at 61.29KiB/s ETA 10:56
    const regExp = /\[download\]\s*(?<progress>.*)\s+of\s+(?<size>.*)\s+at\s+(?<speed>.*)\s+ETA\s+(?<eta>.*)/gim;
    const match = regExp.exec(stdout);
    if (match != null) {
        cmd.log(log.format('download %s of %s at %s ETA %s', [
            (_a = match.groups) === null || _a === void 0 ? void 0 : _a.progress,
            (_b = match.groups) === null || _b === void 0 ? void 0 : _b.size,
            (_c = match.groups) === null || _c === void 0 ? void 0 : _c.speed,
            (_d = match.groups) === null || _d === void 0 ? void 0 : _d.eta
        ]));
    }
}
function downloadVideo(cmd, youtubeId, parentDir) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            const command = child_process_1.default.spawn('youtube-dl', [
                '--format',
                'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
                '--output',
                youtubeId,
                '--write-thumbnail',
                youtubeId
            ], { cwd: parentDir });
            let stdout = '';
            let stderr = '';
            command.stdout.on('data', (data) => {
                parseYoutubeDlProgressStdOut(cmd, data.toString());
                stdout = stdout + data.toString();
            });
            // somehow songbook build stays open without this event.
            command.stderr.on('data', (data) => {
                stderr = stderr + data.toString();
            });
            command.on('error', code => {
                reject(new Error(stderr));
            });
            command.on('exit', code => {
                if (code === 0) {
                    resolve(youtubeId);
                }
                else {
                    reject(new Error(stderr));
                }
            });
        });
    });
}
/**
 *
 */
function action(youtubeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const meta = (yield requestYoutubeApi(youtubeId));
        if (meta == null) {
            log.error('Metadata of the YouTube video “%s” could not be fetched.', [
                youtubeId
            ]);
            return;
        }
        const metaData = meta;
        log.verboseAny(metaData);
        const parentDir = media_manager_1.locationIndicator.getPresParentDir(process.cwd());
        if (parentDir == null) {
            throw new Error('You are not in a presentation folder!');
        }
        const ytDir = path_1.default.join(parentDir, 'YT');
        if (!fs_1.default.existsSync(ytDir)) {
            fs_1.default.mkdirSync(ytDir);
        }
        const cmd = new cli_utils_1.CommandRunner({ verbose: true });
        cmd.startSpin();
        cmd.log('Updating youtube-dl using pip3.');
        yield cmd.exec(['pip3', 'install', '--upgrade', 'youtube-dl']);
        cmd.log('Downloading the YouTube video.');
        // [download]   2.9% of 118.39MiB at 82.11KiB/s ETA 23:53
        yield downloadVideo(cmd, youtubeId, ytDir);
        const ytFile = path_1.default.resolve(ytDir, `${youtubeId}.mp4`);
        cmd.log('Creating the metadata file in the YAML format.');
        metaData.categories = 'youtube';
        yield media_manager_1.operations.initializeMetaYaml(ytFile, metaData);
        cmd.log('Normalizing the metadata file.');
        yield media_manager_1.operations.normalizeMediaAsset(ytFile);
        const srcPreviewJpg = ytFile.replace(/\.mp4$/, '.jpg');
        const srcPreviewWebp = ytFile.replace(/\.mp4$/, '.webp');
        const destPreview = ytFile.replace(/\.mp4$/, '.mp4_preview.jpg');
        if (fs_1.default.existsSync(srcPreviewJpg)) {
            fs_1.default.renameSync(srcPreviewJpg, destPreview);
        }
        else if (fs_1.default.existsSync(srcPreviewWebp)) {
            yield cmd.exec(['magick', 'convert', srcPreviewWebp, destPreview], {
                cwd: ytDir
            });
            fs_1.default.unlinkSync(srcPreviewWebp);
        }
        cmd.stopSpin();
    });
}
module.exports = action;
