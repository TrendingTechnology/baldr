"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recording = void 0;
const main_1 = require("../main");
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
            }
        },
        musicbrainzRecordingId: {
            title: 'MusicBrainz-Aufnahme-ID',
            validate: main_1.validateUuid,
            wikidata: {
                fromClaim: 'P4404',
                format: 'formatSingleValue'
            },
            derive: function ({}) {
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
