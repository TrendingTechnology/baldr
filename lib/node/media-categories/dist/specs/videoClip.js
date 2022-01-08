/**
 * The meta data type specification “videoClip”.
 */
export const videoClip = {
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
