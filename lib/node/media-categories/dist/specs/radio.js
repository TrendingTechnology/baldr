var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
            derive: function ({ filePath }) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getAudioMetadataValue('title', filePath);
                });
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
