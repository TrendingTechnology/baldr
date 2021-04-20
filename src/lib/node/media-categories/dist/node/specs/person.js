"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.person = void 0;
const path_1 = __importDefault(require("path"));
const main_1 = require("../main");
const core_browser_1 = require("@bldr/core-browser");
const config_1 = __importDefault(require("@bldr/config"));
/**
 * The meta data type specification “person”.
 */
exports.person = {
    title: 'Person',
    abbreviation: 'PR',
    basePath: path_1.default.join(config_1.default.mediaServer.basePath, 'Personen'),
    relPath: function ({ data }) {
        return path_1.default.join(data.personId.substr(0, 1).toLowerCase(), data.personId, `main.${data.extension}`);
    },
    detectCategoryByPath: function (category) {
        return new RegExp('^' + category.basePath + '/.*(jpg|png)');
    },
    normalizeWikidata: function ({ data, entity, functions }) {
        const label = functions.getLabel(entity);
        const segments = label.split(' ');
        const firstnameFromLabel = segments.shift();
        const lastnameFromLabel = segments.pop();
        // Use the label by artist names.
        // for example „Joan Baez“ and not „Joan Chandos“
        if (firstnameFromLabel && lastnameFromLabel &&
            (data.firstname !== firstnameFromLabel || data.lastname !== lastnameFromLabel)) {
            data.firstname = firstnameFromLabel;
            data.lastname = lastnameFromLabel;
            data.name = label;
        }
        return data;
    },
    props: {
        personId: {
            title: 'Personen-ID',
            derive: function ({ data }) {
                return `${core_browser_1.idify(data.lastname)}_${core_browser_1.idify(data.firstname)}`;
            },
            overwriteByDerived: true
        },
        id: {
            title: 'ID der Person',
            derive: function ({ data, category }) {
                return `${category.abbreviation}_${core_browser_1.idify(data.lastname)}_${core_browser_1.idify(data.firstname)}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel der Person',
            derive: function ({ data }) {
                return `Portrait-Bild von „${data.firstname} ${data.lastname}“`;
            },
            overwriteByDerived: true
        },
        firstname: {
            title: 'Vorname',
            required: true,
            wikidata: {
                // Vornamen der Person
                fromClaim: 'P735',
                secondQuery: 'queryLabels',
                format: function (value, category) {
                    if (Array.isArray(value)) {
                        return value.join(' ');
                    }
                    return value;
                }
            }
        },
        lastname: {
            title: 'Familienname',
            required: true,
            wikidata: {
                // Familienname einer Person
                fromClaim: 'P734',
                secondQuery: 'queryLabels',
                format: function (value, category) {
                    if (Array.isArray(value)) {
                        return value.join(' ');
                    }
                    return value;
                }
            }
        },
        name: {
            title: 'Name (Vor- und Familienname)',
            derive: function ({ data }) {
                return `${data.firstname} ${data.lastname}`;
            },
            overwriteByDerived: false
        },
        shortBiography: {
            title: 'Kurzbiographie',
            required: true,
            wikidata: {
                fromEntity: 'getDescription'
            }
        },
        birth: {
            title: 'Geburtstag',
            validate: main_1.validateDate,
            wikidata: {
                // Geburtsdatum
                fromClaim: 'P569',
                format: 'formatDate',
                alwaysUpdate: true
            }
        },
        death: {
            title: 'Todestag',
            validate: main_1.validateDate,
            wikidata: {
                // Sterbedatum
                fromClaim: 'P570',
                format: 'formatDate',
                alwaysUpdate: true
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
        famousPieces: {
            title: 'Bekannte Stücke',
            validate: function (value) {
                return Array.isArray(value);
            }
        },
        wikicommons: {
            title: 'Wikicommons',
            state: 'absent'
        }
    }
};
