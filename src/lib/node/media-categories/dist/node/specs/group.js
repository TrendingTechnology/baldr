"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.group = void 0;
const path_1 = __importDefault(require("path"));
const core_browser_1 = require("@bldr/core-browser");
const config_1 = __importDefault(require("@bldr/config"));
const main_1 = require("../main");
/**
 * The meta data type specification “group”.
 */
exports.group = {
    title: 'Gruppe',
    abbreviation: 'GR',
    basePath: path_1.default.join(config_1.default.mediaServer.basePath, 'Gruppen'),
    relPath: function ({ data }) {
        return path_1.default.join(data.groupId.substr(0, 1).toLowerCase(), data.groupId, `main.${data.extension}`);
    },
    detectCategoryByPath: function (category) {
        return new RegExp('^' + category.basePath + '/.*');
    },
    props: {
        groupId: {
            title: 'Gruppen-ID',
            derive: function ({ data }) {
                return data.name;
            },
            format: function (value, {}) {
                value = value.replace(/^(The)[ -](.*)$/, '$2_$1');
                value = core_browser_1.idify(value);
                return value;
            },
            overwriteByDerived: true
        },
        id: {
            title: 'ID zur Referenzierung (Präfix „GR_“)',
            derive: function ({ data }) {
                return data.name;
            },
            format: function (value, {}) {
                value = value.replace(/^(The)[ -](.*)$/, '$2_$1');
                value = core_browser_1.idify(value);
                return `GR_${value}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel der Gruppe',
            derive: function ({ data }) {
                return `Portrait-Bild der Gruppe „${data.name}“`;
            },
            overwriteByDerived: true
        },
        name: {
            title: 'Name der Gruppe',
            required: true,
            wikidata: {
                // offizieller Name
                fromClaim: 'P1448',
                fromEntity: 'getLabel'
            }
        },
        logo: {
            title: 'Logo der Band (Wikicommons-Datei)',
            wikidata: {
                // Logo
                fromClaim: 'P154',
                format: 'formatWikicommons'
            }
        },
        shortHistory: {
            title: 'kurze Bandgeschichte',
            wikidata: {
                fromEntity: 'getDescription'
            }
        },
        startDate: {
            title: 'Gründung',
            wikidata: {
                // Gründung, Erstellung bzw. Entstehung
                fromClaim: 'P571',
                format: 'formatDate'
            },
            validate: main_1.validateDate
        },
        endDate: {
            title: 'Auflösung',
            wikidata: {
                // Auflösungsdatum
                fromClaim: 'P576',
                format: 'formatDate'
            },
            validate: main_1.validateDate
        },
        members: {
            title: 'Mitglieder',
            wikidata: {
                // besteht aus
                fromClaim: 'P527',
                secondQuery: 'queryLabels'
            }
        },
        mainImage: {
            title: 'Haupt-Bild',
            wikidata: {
                // Bild
                fromClaim: 'P18',
                format: 'formatWikicommons'
            }
        },
        famousPieces: {
            title: 'Bekannte Stücke',
            validate: function (value) {
                return Array.isArray(value);
            }
        }
    }
};
