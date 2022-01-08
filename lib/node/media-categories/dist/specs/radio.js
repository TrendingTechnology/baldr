import { validateMediaId } from '../main';
import { getAudioMetadataValue } from '../audio-metadata';
/**
 * The meta data type specification “radio”.
 */
export const radio = {
    title: 'Schulfunk',
    detectCategoryByPath: new RegExp('^.*/SF/.*(m4a|mp3)$'),
    abbreviation: 'SF',
    props: {
        title: {
            title: 'Titel',
            derive: async function ({ filePath }) {
                return getAudioMetadataValue('title', filePath);
            }
        },
        author: {
            title: 'Autor*in'
        },
        cover: {
            title: 'Vorschau-Bild',
            validate: validateMediaId
        },
        year: {
            title: 'Erscheinungsjahr'
        },
        transcription: {
            title: 'Transkription'
        },
        composer: {
            title: 'Komponist',
            state: 'absent'
        },
        artist: {
            title: 'Künstler',
            state: 'absent'
        }
    }
};
