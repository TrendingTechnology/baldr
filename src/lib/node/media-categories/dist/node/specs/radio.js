"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.radio = void 0;
const main_1 = require("../main");
/**
 * The meta data type specification “radio”.
 */
exports.radio = {
    title: 'Schulfunk',
    detectCategoryByPath: new RegExp('^.*/SF/.*(m4a|mp3)$'),
    abbreviation: 'SF',
    props: {
        author: {
            title: 'Autor*in'
        },
        cover: {
            title: 'Vorschau-Bild',
            validate: main_1.validateMediaId
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
