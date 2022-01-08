import { getConfig } from '@bldr/config';
import { getHttp } from '@bldr/media-resolver';
const config = getConfig();
export function convertYoutubeIdToUri(youtubeId) {
    return `ref:YT_${youtubeId}`;
}
/**
 * https://stackoverflow.com/a/55890696/10193818
 *
 * Low quality
 * https://img.youtube.com/vi/[video-id]/sddefault.jpg
 *
 * medium quality
 * https://img.youtube.com/vi/[video-id]/mqdefault.jpg
 *
 * High quality
 * http://img.youtube.com/vi/[video-id]/hqdefault.jpg
 *
 * maximum resolution
 * http://img.youtube.com/vi/[video-id]/maxresdefault.jpg
 */
export function findPreviewHttpUrl(youtubeId, asset) {
    if (asset == null) {
        return `http://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }
    else {
        return asset.previewHttpUrl;
    }
}
export async function getSnippet(youtubeId) {
    const snippet = await getHttp('https://www.googleapis.com/youtube/v3/videos', {
        params: {
            part: 'snippet',
            id: youtubeId,
            key: config.youtube.apiKey
        }
    });
    if (snippet.data.items.length > 0) {
        return snippet.data.items[0].snippet;
    }
}
export async function checkAvailability(youtubeId) {
    const snippet = await getSnippet(youtubeId);
    if (snippet != null)
        return true;
    return false;
}
export class YoutubeMaster {
    name = 'youtube';
    displayName = 'YouTube';
    icon = {
        name: 'youtube',
        color: 'red',
        /**
         * U+1F534
         *
         * @see https://emojipedia.org/large-red-circle/
         */
        unicodeSymbol: '🔴'
    };
    fieldsDefintion = {
        youtubeId: {
            type: String,
            required: true,
            description: 'Die Youtube-ID (z. B. xtKavZG1KiM).'
        },
        heading: {
            type: String,
            description: 'Eigene Überschrift',
            markup: true
        },
        info: {
            type: String,
            description: 'längerer Informations-Text',
            markup: true
        }
    };
    shortFormField = 'youtubeId';
    collectOptionalMediaUris(fields) {
        return convertYoutubeIdToUri(fields.youtubeId);
    }
}
