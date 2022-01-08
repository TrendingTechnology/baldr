import path from 'path';
import { referencify } from '@bldr/string-format';
import { getConfig } from '@bldr/config';
const config = getConfig();
function check(data) {
    if (data.name == null) {
        throw new Error('A instrument needs a name.');
    }
}
/**
 * The meta data type specification “instrument”.
 */
export const instrument = {
    title: 'Instrument',
    abbreviation: 'IN',
    basePath: path.join(config.mediaServer.basePath, 'Musik', 'Instrumente'),
    relPath: function ({ data }) {
        const instrumentData = data;
        const id = data.instrumentId.replace(/^IN_/, '');
        return path.join(id.substr(0, 1).toLowerCase(), id, `main.${instrumentData.extension}`);
    },
    detectCategoryByPath: function (category) {
        const instrumentCategory = category;
        return new RegExp(`^${instrumentCategory.basePath}.*/main\\.jpg$`);
    },
    props: {
        instrumentId: {
            title: 'Instrumenten-ID',
            derive: function ({ data }) {
                return referencify(data.name);
            }
        },
        ref: {
            title: 'ID zur Referenzierung (Präfix „IN_“)',
            derive: function ({ data, category }) {
                check(data);
                // IS: Instrument
                const instrumentCategory = category;
                const instrumentData = data;
                return `${instrumentCategory.abbreviation}_${referencify(instrumentData.name)}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel des Instruments',
            derive: function ({ data }) {
                check(data);
                const instrumentData = data;
                return `Foto des Instruments „${instrumentData.name}“`;
            },
            overwriteByDerived: true
        },
        name: {
            title: 'Name des Instruments',
            wikidata: {
                fromEntity: 'getLabel'
            },
            required: true
        },
        description: {
            title: 'Titel des Instruments',
            wikidata: {
                fromEntity: 'getDescription',
                alwaysUpdate: false
            }
        },
        mainImage: {
            title: 'Hauptbild',
            wikidata: {
                // Bild
                fromClaim: 'P18',
                format: 'formatWikicommons'
            }
        },
        playingRangeImage: {
            title: 'Bild des Tonumfangs',
            wikidata: {
                // Bild des Tonumfang
                fromClaim: 'P2343',
                format: 'formatWikicommons'
            }
        },
        audioSamples: {
            title: 'Hörproben des Instruments'
        }
    }
};
