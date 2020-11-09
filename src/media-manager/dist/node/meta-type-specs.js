"use strict";
/**
 * This module contains the specification of the meta data types.
 *
 * A media asset can be attached to multiple meta data types (for example:
 * `meta_types: recording,composition`). All meta data types belong to the type
 * `general`.
 *
 * The corresponding module is called
 * {@link module:@bldr/media-server/meta-types}
 *
 * Some meta data type properties can be enriched by using
 * {@link module:@bldr/wikidata wikidata}.
 *
 * @module @bldr/media-manager/meta-type-specs
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Node packages.
const path_1 = __importDefault(require("path"));
// Third party packages.
const uuid_1 = require("uuid");
// Project packages.
const core_node_1 = require("@bldr/core-node");
const core_browser_1 = require("@bldr/core-browser");
const config_1 = __importDefault(require("@bldr/config"));
const helper_1 = require("./helper");
const two_letter_abbreviations_1 = require("./two-letter-abbreviations");
/**
 * Validate a date string in the format `yyyy-mm-dd`.
 */
function validateDate(value) {
    return value.match(/\d{4,}-\d{2,}-\d{2,}/) ? true : false;
}
/**
 * Validate a ID string of the Baldr media server.
 */
function validateMediaId(value) {
    return value.match(core_browser_1.mediaUriRegExp) ? true : false;
}
/**
 * Validate UUID string (for the Musicbrainz references).
 */
function validateUuid(value) {
    return value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i) ? true : false;
}
/**
 * Validate a YouTube ID.
 */
function validateYoutubeId(value) {
    // https://webapps.stackexchange.com/a/101153
    return value.match(/^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/) ? true : false;
}
/**
 * Generate a ID prefix for media assets, like `Presentation-ID_HB` if the
 * path of the media file is `10_Presentation-id/HB/example.mp3`.
 *
 * @param filePath - The media asset file path.
 *
 * @returns The ID prefix.
 */
function generateIdPrefix(filePath) {
    // We need the absolute path
    filePath = path_1.default.resolve(filePath);
    const pathSegments = filePath.split(path_1.default.sep);
    // HB
    const parentDir = pathSegments[pathSegments.length - 2];
    // Match asset type abbreviations, like AB, HB, NB
    if (parentDir.length !== 2 || !parentDir.match(/[A-Z]{2,}/)) {
        return '';
    }
    const assetTypeAbbreviation = parentDir;
    // 20_Strawinsky-Petruschka
    const subParentDir = pathSegments[pathSegments.length - 3];
    // Strawinsky-Petruschka
    const presentationId = subParentDir.replace(/^[0-9]{2,}_/, '');
    // Strawinsky-Petruschka_HB
    const idPrefix = `${presentationId}_${assetTypeAbbreviation}`;
    return idPrefix;
}
/**
 * The meta data type specification “cloze”.
 */
const cloze = {
    title: 'Lückentext',
    abbreviation: 'LT',
    detectTypeByPath: function () {
        return new RegExp('^.*/LT/.*.svg$');
    },
    initialize({ typeData }) {
        if (typeData.filePath && !typeData.clozePageNo) {
            const match = typeData.filePath.match(/(\d+)\.svg/);
            if (match)
                typeData.clozePageNo = parseInt(match[1]);
        }
        return typeData;
    },
    relPath({ typeData, typeSpec, oldRelPath }) {
        const oldRelDir = path_1.default.dirname(oldRelPath);
        let pageNo = '';
        if (typeData.clozePageNo)
            pageNo = `_${typeData.clozePageNo}`;
        return path_1.default.join(oldRelDir, `Lueckentext${pageNo}.svg`);
    },
    props: {
        id: {
            title: 'Die ID des Lückentexts',
            derive: function ({ typeData, folderTitles, filePath }) {
                let counterSuffix = '';
                if (typeData.clozePageNo) {
                    counterSuffix = `_${typeData.clozePageNo}`;
                }
                return `${folderTitles.id}_LT${counterSuffix}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel des Lückentextes',
            derive: function ({ typeData, folderTitles, filePath }) {
                let suffix = '';
                if (typeData.clozePageNo && typeData.clozePageCount) {
                    suffix = ` (Seite ${typeData.clozePageNo} von ${typeData.clozePageCount})`;
                }
                else if (typeData.clozePageNo && !typeData.clozePageCount) {
                    suffix = ` (Seite ${typeData.clozePageNo})`;
                }
                return `Lückentext zum Thema „${folderTitles.titleAndSubtitle}“${suffix}`;
            },
            overwriteByDerived: true
        },
        clozePageNo: {
            title: 'Seitenzahl des Lückentextes',
            validate(value) {
                return Number.isInteger(value);
            }
        },
        clozePageCount: {
            title: 'Seitenanzahl des Lückentextes',
            validate(value) {
                return Number.isInteger(value);
            }
        }
    }
};
/**
 * The meta data type specification “composition”.
 */
const composition = {
    title: 'Komposition',
    detectTypeByPath: new RegExp('^.*/HB/.*(m4a|mp3)$'),
    props: {
        title: {
            title: 'Titel der Komponist',
            // 'Tonart CD 4: Spur 29'
            removeByRegexp: /^.*CD.*Spur.*$/i
        },
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
        },
        lyricist: {
            title: 'LiedtexterIn',
            wikidata: {
                // Text von | Autor des Liedtexts | Texter | Autor (Liedtext) | geschrieben von
                fromClaim: 'P676',
                secondQuery: 'queryLabels',
                format: 'formatList'
            }
        },
        creationDate: {
            title: 'Entstehungs-Datum',
            wikidata: {
                // Gründung, Erstellung bzw. Entstehung (P571)
                // Veröffentlichungsdatum (P577)
                // Datum der Erst- oder Uraufführung (P1191)
                fromClaim: ['P571', 'P577', 'P1191'],
                format: 'formatYear'
            }
        },
        // now combined in creationDate
        publicationDate: {
            title: 'Veröffentlichungsdatum',
            state: 'absent'
        },
        partOf: {
            title: 'Teil eines übergeordneten Werks'
        },
        // now combined in creationDate
        firstPerformance: {
            title: 'Uraufführung',
            state: 'absent'
        },
        imslp: {
            title: 'IMSLP-ID',
            wikidata: {
                // IMSLP-ID
                fromClaim: 'P839'
            }
        },
        musicbrainzWorkId: {
            title: 'MusikBrainz-Werk-ID',
            validate: validateUuid,
            wikidata: {
                // MusicBrainz-Werk-ID
                fromClaim: 'P435',
                format: 'formatSingleValue'
            }
        }
    }
};
/**
 * The meta data type specification “cover”.
 */
const cover = {
    title: 'Vorschau-Bild',
    detectTypeByPath: new RegExp('^.*/HB/.*(png|jpg)$'),
    props: {
        title: {
            title: 'Titel',
            format: function (value) {
                return value.replace(/^(Cover-Bild: )?/, 'Cover-Bild: ');
            }
        },
        source: {
            title: 'Quelle (HTTP-URL)',
            validate(value) {
                return value.match(/^https?.*$/);
            }
        }
    }
};
/**
 * The meta data type specification “group”.
 */
const group = {
    title: 'Gruppe',
    abbreviation: 'GR',
    basePath: path_1.default.join(config_1.default.mediaServer.basePath, 'Gruppen'),
    relPath: function ({ typeData, typeSpec }) {
        return path_1.default.join(typeData.id.substr(0, 1).toLowerCase(), typeData.id, `main.${typeData.extension}`);
    },
    detectTypeByPath: function (typeSpec) {
        return new RegExp('^' + typeSpec.basePath + '/.*');
    },
    props: {
        groupId: {
            title: 'Gruppen-ID',
            derive: function ({ typeData }) {
                return typeData.name;
            },
            format: function (value, { typeData, typeSpec }) {
                value = value.replace(/^(The)[ -](.*)$/, '$2_$1');
                value = helper_1.idify(value);
                return value;
            },
            overwriteByDerived: true
        },
        id: {
            title: 'ID zur Referenzierung (Präfix „GR_“)',
            derive: function ({ typeData }) {
                return typeData.name;
            },
            format: function (value, { typeData, typeSpec }) {
                value = value.replace(/^(The)[ -](.*)$/, '$2_$1');
                value = helper_1.idify(value);
                return `GR_${value}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel der Gruppe',
            derive: function ({ typeData }) {
                return `Portrait-Bild der Gruppe „${typeData.name}“`;
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
            validate: validateDate
        },
        endDate: {
            title: 'Auflösung',
            wikidata: {
                // Auflösungsdatum
                fromClaim: 'P576',
                format: 'formatDate'
            },
            validate: validateDate
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
/**
 * The meta data type specification “instrument”.
 */
const instrument = {
    title: 'Instrument',
    abbreviation: 'IN',
    basePath: path_1.default.join(config_1.default.mediaServer.basePath, 'Instrumente'),
    relPath: function ({ typeData, typeSpec }) {
        const id = typeData.id.replace(/^IN_/, '');
        return path_1.default.join(id.substr(0, 1).toLowerCase(), id, `main.${typeData.extension}`);
    },
    detectTypeByPath: function (typeSpec) {
        return new RegExp(`^${typeSpec.basePath}.*/main\\.jpg$`);
    },
    props: {
        instrumentId: {
            title: 'Instrumenten-ID',
            derive: function ({ typeData }) {
                return helper_1.idify(typeData.name);
            }
        },
        id: {
            title: 'ID zur Referenzierung (Präfix „IN_“)',
            derive: function ({ typeData, typeSpec }) {
                // IS: Instrument
                return `${typeSpec.abbreviation}_${helper_1.idify(typeData.name)}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel des Instruments',
            derive: function ({ typeData }) {
                return `Foto des Instruments „${typeData.name}“`;
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
/**
 * The meta data type specification “person”.
 */
const person = {
    title: 'Person',
    abbreviation: 'PR',
    basePath: path_1.default.join(config_1.default.mediaServer.basePath, 'Personen'),
    relPath: function ({ typeData }) {
        return path_1.default.join(typeData.personId.substr(0, 1).toLowerCase(), typeData.personId, `main.${typeData.extension}`);
    },
    detectTypeByPath: function (typeSpec) {
        return new RegExp('^' + typeSpec.basePath + '/.*(jpg|png)');
    },
    normalizeWikidata: function ({ typeData, entity, functions }) {
        const label = functions.getLabel(entity);
        const segments = label.split(' ');
        const firstnameFromLabel = segments.shift();
        const lastnameFromLabel = segments.pop();
        // Use the label by artist names.
        // for example „Joan Baez“ and not „Joan Chandos“
        if (firstnameFromLabel && lastnameFromLabel &&
            (typeData.firstname !== firstnameFromLabel || typeData.lastname !== lastnameFromLabel)) {
            typeData.firstname = firstnameFromLabel;
            typeData.lastname = lastnameFromLabel;
            typeData.name = label;
        }
        return typeData;
    },
    props: {
        personId: {
            title: 'Personen-ID',
            derive: function ({ typeData }) {
                return `${helper_1.idify(typeData.lastname)}_${helper_1.idify(typeData.firstname)}`;
            },
            overwriteByDerived: true
        },
        id: {
            title: 'ID der Person',
            derive: function ({ typeData, typeSpec }) {
                return `${typeSpec.abbreviation}_${helper_1.idify(typeData.lastname)}_${helper_1.idify(typeData.firstname)}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel der Person',
            derive: function ({ typeData }) {
                return `Portrait-Bild von „${typeData.firstname} ${typeData.lastname}“`;
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
                format: function (value, typeSpec) {
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
                format: function (value, typeSpec) {
                    if (Array.isArray(value)) {
                        return value.join(' ');
                    }
                    return value;
                }
            }
        },
        name: {
            title: 'Name (Vor- und Familienname)',
            derive: function ({ typeData }) {
                return `${typeData.firstname} ${typeData.lastname}`;
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
            validate: validateDate,
            wikidata: {
                // Geburtsdatum
                fromClaim: 'P569',
                format: 'formatDate',
                alwaysUpdate: true
            }
        },
        death: {
            title: 'Todestag',
            validate: validateDate,
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
/**
 * The meta data type specification “photo”.
 */
const photo = {
    title: 'Foto',
    abbreviation: 'FT',
    detectTypeByPath: function () {
        return new RegExp('^.*/FT/.*.jpg$');
    },
    props: {
        photographer: {
            title: 'Fotograph*in'
        }
    }
};
/**
 * The meta data type specification “radio”.
 */
const radio = {
    title: 'Schulfunk',
    abbreviation: 'SF',
    props: {
        author: {
            title: 'Autor*in'
        }
    }
};
/**
 * The meta data type specification “recording”.
 */
const recording = {
    title: 'Aufnahme',
    detectTypeByPath: new RegExp('^.*/HB/.*(m4a|mp3)$'),
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
            validate: validateUuid,
            wikidata: {
                fromClaim: 'P4404',
                format: 'formatSingleValue'
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
        cover: {
            title: 'Vorschau-Bild',
            validate: validateMediaId
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
/**
 * The meta data type specification “reference”.
 */
const reference = {
    title: 'Quelle',
    description: 'Quelle, auf der eine Unterrichtsstunde aufbaut, z. B. Auszüge aus Schulbüchern.',
    detectTypeByPath: function () {
        return new RegExp('^.*/QL/.*.pdf$');
    },
    abbreviation: 'QL',
    props: {
        title: {
            title: 'Titel der Quelle',
            derive: function ({ typeData, folderTitles, filePath }) {
                let suffix = '';
                if (typeData.forTeacher) {
                    suffix = ` (Lehrerband)`;
                }
                return `Quelle zum Thema „${folderTitles.titleAndSubtitle}“${suffix}`;
            },
            overwriteByDerived: true
        },
        referenceTitle: {
            title: 'Title der (übergeordneten Quelle)'
        },
        referenceSubtitle: {
            title: 'Untertitel der (übergeordneten Quelle)'
        },
        author: {
            title: 'Autor'
        },
        publisher: {
            title: 'Verlag'
        },
        releaseDate: {
            title: 'Erscheinungsdatum'
        },
        edition: {
            title: 'Auflage',
            description: 'z. B. 1. Auflage des Buchs'
        },
        pageNos: {
            title: 'Seitenzahlen',
            description: 'Auf welchen Seiten aus der Quelle dieser Auszug zu finden war. Nicht zu verwechseln mit der Seitenanzahl des PDFs.'
        },
        forTeacher: {
            title: 'Lehrerband'
        },
        isbn: {
            title: 'ISBN-Nummer (13 Stellen)'
        },
        pageCount: {
            title: 'Seitenanzahl des PDFs',
            description: 'Die Seitenanzahl dieses PDFs',
            derive({ filePath }) {
                return core_node_1.getPdfPageCount(filePath);
            },
            overwriteByDerived: true
        }
    }
};
/**
 * The meta data type specification “score”.
 */
const score = {
    title: 'Partitur',
    abbreviation: 'PT',
    detectTypeByPath: function () {
        return new RegExp('^.*/PT/.*.pdf$');
    },
    props: {
        imslpWorkId: {
            title: 'IMSLP-Werk-ID',
            description: 'Z. B.: The_Firebird_(Stravinsky,_Igor)'
        },
        imslpScoreId: {
            title: 'IMSLP Partitur-ID: z. B. PMLP179424-PMLUS00570-Complete_Score_1.pdf'
        },
        publisher: {
            title: 'Verlag'
        }
    }
};
/**
 * The meta data type specification “song”.
 */
const song = {
    title: 'Lied',
    props: {
        publicationDate: {
            title: 'Veröffentlichungsdatum',
            wikidata: {
                // Veröffentlichungsdatum
                fromClaim: 'P577',
                format: 'formatDate'
            },
        },
        language: {
            title: 'Sprache',
            wikidata: {
                // Sprache des Werks, Namens oder Begriffes
                fromClaim: 'P407',
                secondQuery: 'queryLabels'
            }
        },
        artist: {
            title: 'InterpretIn',
            wikidata: {
                // Interpret
                fromClaim: 'P175',
                secondQuery: 'queryLabels'
            }
        },
        lyricist: {
            title: 'LiedtexterIn',
            wikidata: {
                // Text von
                fromClaim: 'P676',
                secondQuery: 'queryLabels'
            }
        },
        genre: {
            title: 'Stil',
            wikidata: {
                // Genre
                fromClaim: 'P136',
                secondQuery: 'queryLabels'
            }
        }
    }
};
/**
 * The meta data type specification “worksheet”.
 */
const worksheet = {
    title: 'Arbeitsblatt',
    abbreviation: 'TX',
    detectTypeByPath: function () {
        return new RegExp('^.*/TX/.*.pdf$');
    },
    props: {
        title: {
            title: "Titel",
            derive: function ({ folderTitles, filePath }) {
                const match = filePath.match(new RegExp(`${path_1.default.sep}([^${path_1.default.sep}]+)\\.pdf`));
                let baseName = 'Arbeitsblatt';
                if (match) {
                    baseName = match[1];
                }
                return `${baseName} zum Thema „${folderTitles.titleAndSubtitle}“`;
            },
            overwriteByDerived: true
        },
        pageCount: {
            title: 'Seitenanzahl des PDFs',
            description: 'Die Seitenanzahl dieses PDFs',
            derive({ filePath }) {
                return core_node_1.getPdfPageCount(filePath);
            },
            overwriteByDerived: true
        }
    }
};
/**
 * The meta data type specification “youtube”.
 */
const youtube = {
    title: 'YouTube-Video',
    abbreviation: 'YT',
    detectTypeByPath: function () {
        return new RegExp('^.*/YT/.*.mp4$');
    },
    relPath({ typeData, typeSpec, oldRelPath }) {
        const oldRelDir = path_1.default.dirname(oldRelPath);
        return path_1.default.join(oldRelDir, `${typeData.youtubeId}.mp4`);
    },
    props: {
        id: {
            title: 'ID eines YouTube-Videos',
            derive: function ({ typeData, typeSpec }) {
                return `${typeSpec.abbreviation}_${typeData.youtubeId}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel eines YouTube-Videos',
            derive: function ({ typeData }) {
                let title;
                if (typeData.heading) {
                    title = typeData.heading;
                }
                else if (typeData.originalHeading) {
                    title = typeData.originalHeading;
                }
                else {
                    title = typeData.youtubeId;
                }
                return `YouTube-Video „${title}“`;
            },
            overwriteByDerived: true
        },
        youtubeId: {
            title: 'Die ID eines YouTube-Videos (z. B. gZ_kez7WVUU)',
            validate: validateYoutubeId
        },
        heading: {
            title: 'Eigene Überschrift'
        },
        info: {
            title: 'Eigener längerer Informationstext'
        },
        original_heading: {
            title: 'Die orignale Überschrift des YouTube-Videos'
        },
        original_info: {
            title: 'Der orignale Informationstext des YouTube-Videos'
        }
    }
};
/**
 * General meta data type specification. Applied after all other meta data
 * types.
 */
const general = {
    title: 'Allgemeiner Metadaten-Type',
    props: {
        id: {
            title: 'ID',
            validate: function (value) {
                return value.match(/^[a-zA-Z0-9-_]+$/);
            },
            format: function (value, { typeData, typeSpec }) {
                value = helper_1.idify(value);
                // a-Strawinsky-Petruschka-Abschnitt-0_22
                value = value.replace(/^[va]-/, '');
                if (typeData.filePath && typeData.metaTypes.indexOf('youtube') === -1) {
                    const idPrefix = generateIdPrefix(typeData.filePath);
                    if (idPrefix) {
                        if (value.indexOf(idPrefix) === -1) {
                            value = `${idPrefix}_${value}`;
                        }
                        // Avoid duplicate idPrefixes by changed prefixes:
                        // instead of:
                        // Piazzolla-Nonino_NB_Piazzolla-Adios-Nonino_NB_Adios-Nonino_melancolico
                        // old prefix: Piazzolla-Adios-Nonino_NB
                        // updated prefix: Piazzolla-Nonino_NB
                        // Preferred result: Piazzolla-Nonino_NB_Adios-Nonino_melancolico
                        const twoLetterRegExp = '(' + two_letter_abbreviations_1.getTwoLetterAbbreviations().join('|') + ')';
                        if (value.match(new RegExp(`.*_${twoLetterRegExp}_.*`))) {
                            value = value.replace(new RegExp(`^.*_${twoLetterRegExp}`), idPrefix);
                        }
                    }
                }
                // Disabled for example GR_Beatles_The != Beatles_GR_The
                // HB_Ausstellung_Gnome -> Ausstellung_HB_Gnome
                // value = value.replace(/^([A-Z]{2,})_([a-zA-Z0-9-]+)_/, '$2_$1_')
                return value;
            },
            required: true
        },
        uuid: {
            title: 'UUID',
            description: 'UUID version 4.',
            derive() {
                return uuid_1.v4();
            },
            overwriteByDerived: false
        },
        metaTypes: {
            title: 'Metadaten-Typen',
            description: 'Zum Beispiel: “person” oder “composition,recording”',
            validate: function (value) {
                return String(value).match(/^[a-zA-Z,]+$/) ? true : false;
            },
            format: function (value) {
                return value.replace(/,?general,?/, '');
            },
            removeByRegexp: new RegExp('^general$')
        },
        metaType: {
            title: 'Metadaten-Type',
            description: 'Heißt jetzt “metaTypes”',
            state: 'absent'
        },
        title: {
            title: 'Titel',
            required: true,
            overwriteByDerived: false,
            format: function (value, { typeData, typeSpec }) {
                // a Strawinsky Petruschka Abschnitt 0_22
                value = value.replace(/^[va] /, '');
                return value;
            },
            derive: function ({ typeData }) {
                return helper_1.deasciify(typeData.id);
            }
        },
        wikidata: {
            title: 'Wikidata',
            validate: function (value) {
                return String(value).match(/^Q\d+$/) ? true : false;
            }
        },
        wikipedia: {
            title: 'Wikipedia',
            validate: function (value) {
                return value.match(/^.+:.+$/);
            },
            format: function (value, { typeData, typeSpec }) {
                return decodeURI(value);
            },
            wikidata: {
                fromEntity: 'getWikipediaTitle',
                alwaysUpdate: true
            }
        },
        youtube: {
            title: 'Youtube-Video-ID',
            description: 'Die Youtube-Video-ID',
            validate: validateYoutubeId,
            wikidata: {
                // YouTube-Video-Kennung
                fromClaim: 'P1651',
                format: 'formatSingleValue'
            }
        },
        // tmp property needed to generate id prefix
        filePath: {
            title: 'Dateipfad',
            state: 'absent'
        },
        // tmp propert: needed for wiki commons files.
        extension: {
            title: 'Dateiendung',
            state: 'absent'
        }
    },
    initialize: function ({ typeData, typeSpec }) {
        if (typeData.filePath && !two_letter_abbreviations_1.checkForTwoLetterDir(typeData.filePath)) {
            console.log(`File path ${typeData.filePath} is not in a valid two letter directory.`);
            process.exit();
        }
        return typeData;
    },
    finalize: function ({ typeData, typeSpec }) {
        for (const propName in typeData) {
            const value = typeData[propName];
            if (typeof value === 'string') {
                typeData[propName] = value.trim();
            }
        }
        return typeData;
    }
};
exports.default = {
    cloze,
    composition,
    cover,
    group,
    instrument,
    person,
    photo,
    radio,
    recording,
    reference,
    score,
    song,
    worksheet,
    youtube,
    // Applied to all
    general
};
