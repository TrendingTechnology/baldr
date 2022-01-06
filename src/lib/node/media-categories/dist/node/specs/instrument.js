"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instrument = void 0;
const path_1 = __importDefault(require("path"));
const string_format_1 = require("@bldr/string-format");
const config_1 = require("@bldr/config");
const config = (0, config_1.getConfig)();
function check(data) {
    if (data.name == null) {
        throw new Error('A instrument needs a name.');
    }
}
/**
 * The meta data type specification “instrument”.
 */
exports.instrument = {
    title: 'Instrument',
    abbreviation: 'IN',
    basePath: path_1.default.join(config.mediaServer.basePath, 'Musik', 'Instrumente'),
    relPath: function ({ data }) {
        const instrumentData = data;
        const id = data.instrumentId.replace(/^IN_/, '');
        return path_1.default.join(id.substr(0, 1).toLowerCase(), id, `main.${instrumentData.extension}`);
    },
    detectCategoryByPath: function (category) {
        const instrumentCategory = category;
        return new RegExp(`^${instrumentCategory.basePath}.*/main\\.jpg$`);
    },
    props: {
        instrumentId: {
            title: 'Instrumenten-ID',
            derive: function ({ data }) {
                return (0, string_format_1.referencify)(data.name);
            }
        },
        ref: {
            title: 'ID zur Referenzierung (Präfix „IN_“)',
            derive: function ({ data, category }) {
                check(data);
                // IS: Instrument
                const instrumentCategory = category;
                const instrumentData = data;
                return `${instrumentCategory.abbreviation}_${(0, string_format_1.referencify)(instrumentData.name)}`;
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
