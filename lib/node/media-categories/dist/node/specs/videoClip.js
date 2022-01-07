"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoClip = void 0;
/**
 * The meta data type specification “videoClip”.
 */
exports.videoClip = {
    title: 'Videoclip',
    props: {
        composer: {
            title: 'KomponstIn',
            // Helbling-Verlag
            removeByRegexp: /^.*Verlag.*$/i,
            wikidata: {
                // Komponist
                fromClaim: 'P86',
                secondQuery: 'queryLabels',
                format: 'formatList'
            }
        }
    }
};
