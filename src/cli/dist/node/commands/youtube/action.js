var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Node packages.
const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
// Project packages.
const { CommandRunner } = require('@bldr/cli-utils');
const { LocationIndicator } = require('@bldr/media-server');
const { operations } = require('@bldr/media-manager');
const config = require('@bldr/config');
const { cwd } = require('../../main.js');
function requestYoutubeApi(youtubeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet',
                id: youtubeId,
                key: config.youtube.apiKey
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
        const location = new LocationIndicator();
        const parentDir = location.getPresParentDir(cwd);
        const ytDir = path.join(parentDir, 'YT');
        if (!fs.existsSync(ytDir)) {
            fs.mkdirSync(ytDir);
        }
        const cmd = new CommandRunner({});
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
        const ytFile = path.resolve(ytDir, `${youtubeId}.mp4`);
        cmd.log('Creating the metadata file in the YAML format.');
        yield operations.initializeMetaYaml(ytFile, metaData);
        cmd.log('Normalizing the metadata file.');
        yield operations.normalizeMediaAsset(ytFile);
        const srcPreviewJpg = ytFile.replace(/\.mp4$/, '.jpg');
        const srcPreviewWebp = ytFile.replace(/\.mp4$/, '.webp');
        const destPreview = ytFile.replace(/\.mp4$/, '.mp4_preview.jpg');
        if (fs.existsSync(srcPreviewJpg)) {
            fs.renameSync(srcPreviewJpg, destPreview);
        }
        else if (fs.existsSync(srcPreviewWebp)) {
            yield cmd.exec(['magick',
                'convert', srcPreviewWebp, destPreview], { cwd: ytDir });
            fs.unlinkSync(srcPreviewWebp);
        }
        cmd.stopSpin();
    });
}
module.exports = action;
