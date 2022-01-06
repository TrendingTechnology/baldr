"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.group = void 0;
const path_1 = __importDefault(require("path"));
const string_format_1 = require("@bldr/string-format");
const main_1 = require("../main");
const config_1 = require("@bldr/config");
const config = (0, config_1.getConfig)();
function check(data) {
    if (data.name == null) {
        throw new Error('A group needs a name.');
    }
}
/**
 * The meta data type specification “group”.
 */
exports.group = {
    title: 'Gruppe',
    abbreviation: 'GR',
    basePath: path_1.default.join(config.mediaServer.basePath, 'Musik', 'Gruppen'),
    relPath: function ({ data }) {
        const groupData = data;
        return path_1.default.join(groupData.groupId.substr(0, 1).toLowerCase(), groupData.groupId, `main.${groupData.extension}`);
    },
    detectCategoryByPath: function (category) {
        const groupCategory = category;
        return new RegExp('^' + groupCategory.basePath + '/.*');
    },
    props: {
        groupId: {
            title: 'Gruppen-ID',
            derive: function ({ data }) {
                return data.name;
            },
            format: function (value) {
                value = value.replace(/^(The)[ -](.*)$/, '$2_$1');
                value = (0, string_format_1.referencify)(value);
                return value;
            },
            overwriteByDerived: true
        },
        ref: {
            title: 'ID zur Referenzierung (Präfix „GR_“)',
            derive: function ({ data }) {
                return data.name;
            },
            format: function (value) {
                value = value.replace(/^(The)[ -](.*)$/, '$2_$1');
                return `GR_${(0, string_format_1.referencify)(value)}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel der Gruppe',
            derive: function ({ data }) {
                check(data);
                const groupData = data;
                return `Portrait-Bild der Gruppe „${groupData.name}“`;
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
