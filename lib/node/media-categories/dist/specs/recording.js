var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validateMediaId, validateUuid } from '../main';
import { getAudioMetadataValue } from '../audio-metadata';
/**
 * The meta data type specification “recording”.
 */
export const recording = {
    title: 'Aufnahme',
    detectCategoryByPath: new RegExp('^.*/HB/.*(m4a|mp3)$'),
    props: {
        artist: {
            title: 'Interpret',
            description: 'Der/die Interpret/in eines Musikstücks.',
            wikidata: {
                // Interpret | Interpretin | Interpretinnen | Darsteller
                fromClaim: 'P175',
                secondQuery: 'queryLabels',
                format: 'formatList'
            },
            derive: function ({ filePath }) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getAudioMetadataValue('artist', filePath);
                });
            }
        },
        musicbrainzRecordingId: {
            title: 'MusicBrainz-Aufnahme-ID',
            validate: validateUuid,
            wikidata: {
                fromClaim: 'P4404',
                format: 'formatSingleValue'
            },
            format(value) {
                return value.replace(/\0/g, '');
            },
            derive: function ({ filePath }) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getAudioMetadataValue('musicbrainz_recording_id', filePath);
                });
            }
        },
        // see composition creationDate
        year: {
            title: 'Jahr',
            state: 'absent'
            // wikidata: {
            //   // Veröffentlichungsdatum
            //   fromClaim: 'P577',
            //   format: 'formatYear'
            // }
        },
        album: {
            title: 'Album',
            state: 'absent'
        },
        recordingYear: {
            title: 'Aufnahme-Jahr',
            state: 'absent'
        },
        cover: {
            title: 'Vorschau-Bild',
            validate: validateMediaId
        },
        coverSource: {
            title: 'Cover-Quelle',
            description: 'HTTP-URL des Vorschau-Bildes.',
            validate(value) {
                return value.match(/^https?.*$/);
            }
        }
    }
};
