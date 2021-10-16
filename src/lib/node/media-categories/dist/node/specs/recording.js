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
Object.defineProperty(exports, "__esModule", { value: true });
exports.recording = void 0;
const main_1 = require("../main");
const audio_metadata_1 = require("../audio-metadata");
/**
 * The meta data type specification “recording”.
 */
exports.recording = {
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
                    return audio_metadata_1.getAudioMetadataValue('artist', filePath);
                });
            }
        },
        musicbrainzRecordingId: {
            title: 'MusicBrainz-Aufnahme-ID',
            validate: main_1.validateUuid,
            wikidata: {
                fromClaim: 'P4404',
                format: 'formatSingleValue'
            },
            derive: function ({ filePath }) {
                return __awaiter(this, void 0, void 0, function* () {
                    return audio_metadata_1.getAudioMetadataValue('musicbrainz_recording_id', filePath);
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
            validate: main_1.validateMediaId
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
