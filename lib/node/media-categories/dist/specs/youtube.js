import path from 'path';
import { validateYoutubeId } from '../main';
/**
 * The meta data type specification “youtube”.
 */
export const youtube = {
    title: 'YouTube-Video',
    abbreviation: 'YT',
    detectCategoryByPath: new RegExp('^.*/YT/.*.mp4$'),
    relPath({ data, oldRelPath }) {
        const youtubeData = data;
        const oldRelDir = path.dirname(oldRelPath);
        return path.join(oldRelDir, `${youtubeData.youtubeId}.mp4`);
    },
    props: {
        ref: {
            title: 'ID eines YouTube-Videos',
            derive: function ({ data, category }) {
                const youtubeCategory = category;
                const youtubeData = data;
                if (youtubeData.youtubeId == undefined) {
                    throw new Error('A Youtube video needs a youtube_id.');
                }
                return `${youtubeCategory.abbreviation}_${youtubeData.youtubeId}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel eines YouTube-Videos',
            derive: function ({ data }) {
                let title;
                if (data.youtubeId == undefined) {
                    throw new Error('A Youtube video needs a youtube_id.');
                }
                if (data.heading != null && data.heading !== '') {
                    title = data.heading;
                }
                else if (data.originalHeading != null &&
                    data.originalHeading !== '') {
                    title = data.originalHeading;
                }
                else {
                    title = data.youtubeId;
                }
                return `YouTube-Video „${title}“`;
            },
            overwriteByDerived: true
        },
        youtubeId: {
            title: 'Die ID eines YouTube-Videos',
            description: 'z. B.: gZ_kez7WVUU',
            validate: validateYoutubeId
        },
        heading: {
            title: 'Eigene Überschrift'
        },
        info: {
            title: 'Eigener längerer Informationstext'
        },
        originalHeading: {
            title: 'Die orignale Überschrift des YouTube-Videos'
        },
        originalInfo: {
            title: 'Der orignale Informationstext des YouTube-Videos'
        },
        transcription: {
            title: 'Transkription'
        }
    }
};
