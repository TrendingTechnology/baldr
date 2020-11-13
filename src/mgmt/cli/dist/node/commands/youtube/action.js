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
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Third party packages.
const axios_1 = __importDefault(require("axios"));
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const media_manager_1 = require("@bldr/media-manager");
const config_1 = __importDefault(require("@bldr/config"));
function requestYoutubeApi(youtubeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield axios_1.default.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet',
                id: youtubeId,
                key: config_1.default.youtube.apiKey
            }
        });
        const snippet = result.data.items[0].snippet;
        return {
            youtubeId,
            originalHeading: snippet.title,
            originalInfo: snippet.description,
        };
    });
}
/**
 *
 */
function action(youtubeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const metaData = yield requestYoutubeApi(youtubeId);
        console.log(metaData);
        const parentDir = media_manager_1.locationIndicator.getPresParentDir(process.cwd());
        const ytDir = path_1.default.join(parentDir, 'YT');
        if (!fs_1.default.existsSync(ytDir)) {
            fs_1.default.mkdirSync(ytDir);
        }
        const cmd = new cli_utils_1.CommandRunner();
        cmd.startSpin();
        cmd.log('Updating youtube-dl using pip3.');
        yield cmd.exec(['pip3', 'install', '--upgrade', 'youtube-dl']);
        cmd.log('Downloading the YouTube video.');
        yield cmd.exec([
            'youtube-dl',
            '--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
            '--output', youtubeId,
            '--write-thumbnail',
            youtubeId
        ], { cwd: ytDir });
        const ytFile = path_1.default.resolve(ytDir, `${youtubeId}.mp4`);
        cmd.log('Creating the metadata file in the YAML format.');
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
            yield cmd.exec(['magick',
                'convert', srcPreviewWebp, destPreview], { cwd: ytDir });
            fs_1.default.unlinkSync(srcPreviewWebp);
        }
        cmd.stopSpin();
    });
}
module.exports = action;
