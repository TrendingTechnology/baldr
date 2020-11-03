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
 * @module @bldr/media-server/meta-type-specs
 */
// Node packages.
var path = require('path');
// Third party packages.
var uuidv4 = require('uuid').v4;
// Project packages.
var _a = require('./helper.js'), deasciify = _a.deasciify, idify = _a.idify;
var getPdfPageCount = require('@bldr/core-node').getPdfPageCount;
var mediaUriRegExp = require('@bldr/core-browser').mediaUriRegExp;
/**
 * The configuration object from `/etc/baldr.json`
 */
var config = require('@bldr/config');
/**
 * Validate a date string in the format `yyyy-mm-dd`.
 *
 * @param {String} value
 *
 * @returns {RegExpMatchArray}
 */
function validateDate(value) {
    return value.match(/\d{4,}-\d{2,}-\d{2,}/);
}
/**
 * Validate a ID string of the Baldr media server.
 *
 * @param {String} value
 *
 * @returns {RegExpMatchArray}
 */
function validateMediaId(value) {
    return value.match(mediaUriRegExp);
}
/**
 * Validate UUID string (for the Musicbrainz references).
 *
 * @param {String} value
 *
 * @returns {RegExpMatchArray}
 */
function validateUuid(value) {
    return value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i);
}
/**
 * Validate a YouTube ID.
 *
 * @param {String} value
 */
function validateYoutubeId(value) {
    // https://webapps.stackexchange.com/a/101153
    return value.match(/^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/);
}
/**
 * Generate a ID prefix for media assets, like `Presentation-ID_HB` if the
 * path of the media file is `10_Presentation-id/HB/example.mp3`.
 *
 * @param {String} filePath - The media asset file path.
 *
 * @returns {String} the ID prefix.
 */
function generateIdPrefix(filePath) {
    // We need the absolute path
    filePath = path.resolve(filePath);
    var pathSegments = filePath.split(path.sep);
    // HB
    var parentDir = pathSegments[pathSegments.length - 2];
    // Match asset type abbreviations, like AB, HB, NB
    if (parentDir.length !== 2 || !parentDir.match(/[A-Z]{2,}/)) {
        return;
    }
    var assetTypeAbbreviation = parentDir;
    // 20_Strawinsky-Petruschka
    var subParentDir = pathSegments[pathSegments.length - 3];
    // Strawinsky-Petruschka
    var presentationId = subParentDir.replace(/^[0-9]{2,}_/, '');
    // Strawinsky-Petruschka_HB
    var idPrefix = presentationId + "_" + assetTypeAbbreviation;
    return idPrefix;
}
/**
 * The meta data type specification “cloze”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var cloze = {
    title: 'Lückentext',
    abbreviation: 'LT',
    detectTypeByPath: function () {
        return new RegExp('^.*/LT/.*.svg$');
    },
    initialize: function (_a) {
        var typeData = _a.typeData;
        if (typeData.filePath && !typeData.clozePageNo) {
            var match = typeData.filePath.match(/(\d+)\.svg/);
            if (match)
                typeData.clozePageNo = parseInt(match[1]);
        }
        return typeData;
    },
    relPath: function (_a) {
        var typeData = _a.typeData, typeSpec = _a.typeSpec, oldRelPath = _a.oldRelPath;
        var oldRelDir = path.dirname(oldRelPath);
        var pageNo = '';
        if (typeData.clozePageNo)
            pageNo = "_" + typeData.clozePageNo;
        return path.join(oldRelDir, "Lueckentext" + pageNo + ".svg");
    },
    props: {
        id: {
            derive: function (_a) {
                var typeData = _a.typeData, folderTitles = _a.folderTitles, filePath = _a.filePath;
                var counterSuffix = '';
                if (typeData.clozePageNo) {
                    counterSuffix = "_" + typeData.clozePageNo;
                }
                return folderTitles.id + "_LT" + counterSuffix;
            },
            overwriteByDerived: true
        },
        title: {
            derive: function (_a) {
                var typeData = _a.typeData, folderTitles = _a.folderTitles, filePath = _a.filePath;
                var suffix = '';
                if (typeData.clozePageNo && typeData.clozePageCount) {
                    suffix = " (Seite " + typeData.clozePageNo + " von " + typeData.clozePageCount + ")";
                }
                else if (typeData.clozePageNo && !typeData.clozePageCount) {
                    suffix = " (Seite " + typeData.clozePageNo + ")";
                }
                return "L\u00FCckentext zum Thema \u201E" + folderTitles.titleAndSubtitle + "\u201C" + suffix;
            },
            overwriteByDerived: true
        },
        clozePageNo: {
            validate: function (value) {
                return Number.isInteger(value);
            }
        },
        clozePageCount: {
            validate: function (value) {
                return Number.isInteger(value);
            }
        }
    }
};
/**
 * The meta data type specification “composition”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var composition = {
    title: 'Komposition',
    detectTypeByPath: new RegExp('^.*/HB/.*m4a$'),
    props: {
        title: {
            // 'Tonart CD 4: Spur 29'
            removeByRegexp: /^.*CD.*Spur.*$/i
        },
        composer: {
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
            wikidata: {
                // Text von | Autor des Liedtexts | Texter | Autor (Liedtext) | geschrieben von
                fromClaim: 'P676',
                secondQuery: 'queryLabels',
                format: 'formatList'
            }
        },
        creationDate: {
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
            state: 'absent'
        },
        partOf: {
            title: 'Teil eines übergeordneten Werks'
        },
        // now combined in creationDate
        firstPerformance: {
            state: 'absent'
        },
        imslp: {
            wikidata: {
                // IMSLP-ID
                fromClaim: 'P839'
            }
        },
        musicbrainzWorkId: {
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
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var cover = {
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
            validate: function (value) {
                return value.match(/^https?.*$/);
            }
        }
    }
};
/**
 * The meta data type specification “group”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var group = {
    title: 'Gruppe',
    abbreviation: 'GR',
    basePath: path.join(config.mediaServer.basePath, 'Gruppen'),
    relPath: function (_a) {
        var typeData = _a.typeData, typeSpec = _a.typeSpec;
        return path.join(typeData.id.substr(0, 1).toLowerCase(), typeData.id, "main." + typeData.extension);
    },
    detectTypeByPath: function (typeSpec) {
        return new RegExp('^' + typeSpec.basePath + '/.*');
    },
    props: {
        groupId: {
            title: 'Gruppen-ID',
            derive: function (_a) {
                var typeData = _a.typeData;
                return typeData.name;
            },
            format: function (value, _a) {
                var typeData = _a.typeData, typeSpec = _a.typeSpec;
                value = value.replace(/^(The)[ -](.*)$/, '$2_$1');
                value = idify(value);
                return value;
            },
            overwriteByDerived: true
        },
        id: {
            title: 'ID zur Referenzierung (Präfix „GR_“)',
            derive: function (_a) {
                var typeData = _a.typeData;
                return typeData.name;
            },
            format: function (value, _a) {
                var typeData = _a.typeData, typeSpec = _a.typeSpec;
                value = value.replace(/^(The)[ -](.*)$/, '$2_$1');
                value = idify(value);
                return "GR_" + value;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel der Gruppe',
            derive: function (_a) {
                var typeData = _a.typeData;
                return "Portrait-Bild der Gruppe \u201E" + typeData.name + "\u201C";
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
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var instrument = {
    title: 'Instrument',
    abbreviation: 'IN',
    basePath: path.join(config.mediaServer.basePath, 'Instrumente'),
    relPath: function (_a) {
        var typeData = _a.typeData, typeSpec = _a.typeSpec;
        var id = typeData.id.replace(/^IN_/, '');
        return path.join(id.substr(0, 1).toLowerCase(), id, "main." + typeData.extension);
    },
    detectTypeByPath: function (typeSpec) {
        return new RegExp("^" + typeSpec.basePath + ".*/main\\.jpg$");
    },
    props: {
        instrumentId: {
            title: 'Instrumenten-ID',
            derive: function (_a) {
                var typeData = _a.typeData;
                return idify(typeData.name);
            }
        },
        id: {
            title: 'ID zur Referenzierung (Präfix „IN_“)',
            derive: function (_a) {
                var typeData = _a.typeData, typeSpec = _a.typeSpec;
                // IS: Instrument
                return typeSpec.abbreviation + "_" + idify(typeData.name);
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel des Instruments',
            derive: function (_a) {
                var typeData = _a.typeData;
                return "Foto des Instruments \u201E" + typeData.name + "\u201C";
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
            wikidata: {
                fromEntity: 'getDescription',
                alwaysUpdate: false
            }
        },
        mainImage: {
            wikidata: {
                // Bild
                fromClaim: 'P18',
                format: 'formatWikicommons'
            }
        },
        playingRangeImage: {
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
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var person = {
    title: 'Person',
    abbreviation: 'PR',
    basePath: path.join(config.mediaServer.basePath, 'Personen'),
    relPath: function (_a) {
        var typeData = _a.typeData;
        return path.join(typeData.personId.substr(0, 1).toLowerCase(), typeData.personId, "main." + typeData.extension);
    },
    detectTypeByPath: function (typeSpec) {
        return new RegExp('^' + typeSpec.basePath + '/.*(jpg|png)');
    },
    normalizeWikidata: function (_a) {
        var typeData = _a.typeData, entity = _a.entity, functions = _a.functions;
        var label = functions.getLabel(entity);
        var segments = label.split(' ');
        var firstnameFromLabel = segments.shift();
        var lastnameFromLabel = segments.pop();
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
            derive: function (_a) {
                var typeData = _a.typeData;
                return idify(typeData.lastname) + "_" + idify(typeData.firstname);
            },
            overwriteByDerived: true
        },
        id: {
            derive: function (_a) {
                var typeData = _a.typeData, typeSpec = _a.typeSpec;
                return typeSpec.abbreviation + "_" + idify(typeData.lastname) + "_" + idify(typeData.firstname);
            },
            overwriteByDerived: true
        },
        title: {
            derive: function (_a) {
                var typeData = _a.typeData;
                return "Portrait-Bild von \u201E" + typeData.firstname + " " + typeData.lastname + "\u201C";
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
                format: function (value, _a) {
                    var typeData = _a.typeData, typeSpec = _a.typeSpec;
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
                format: function (value, _a) {
                    var typeData = _a.typeData, typeSpec = _a.typeSpec;
                    if (Array.isArray(value)) {
                        return value.join(' ');
                    }
                    return value;
                }
            }
        },
        name: {
            title: 'Name (Vor- und Familienname)',
            derive: function (_a) {
                var typeData = _a.typeData;
                return typeData.firstname + " " + typeData.lastname;
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
            state: 'absent'
        }
    }
};
/**
 * The meta data type specification “photo”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var photo = {
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
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var radio = {
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
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var recording = {
    title: 'Aufnahme',
    detectTypeByPath: new RegExp('^.*/HB/.*m4a$'),
    props: {
        artist: {
            description: 'Der/die Interpret/in eines Musikstücks.',
            wikidata: {
                // Interpret | Interpretin | Interpretinnen | Darsteller
                fromClaim: 'P175',
                secondQuery: 'queryLabels',
                format: 'formatList'
            }
        },
        musicbrainzRecordingId: {
            validate: validateUuid,
            wikidata: {
                // MusicBrainz-Aufnahme-ID
                fromClaim: 'P4404',
                format: 'formatSingleValue'
            }
        },
        // see composition creationDate
        year: {
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
            validate: function (value) {
                return value.match(/^https?.*$/);
            }
        }
    }
};
/**
 * The meta data type specification “reference”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var reference = {
    title: 'Quelle',
    description: 'Quelle, auf der eine Unterrichtsstunde aufbaut, z. B. Auszüge aus Schulbüchern.',
    detectTypeByPath: function () {
        return new RegExp('^.*/QL/.*.pdf$');
    },
    abbreviation: 'QL',
    props: {
        title: {
            derive: function (_a) {
                var typeData = _a.typeData, folderTitles = _a.folderTitles, filePath = _a.filePath;
                var suffix = '';
                if (typeData.forTeacher) {
                    suffix = " (Lehrerband)";
                }
                return "Quelle zum Thema \u201E" + folderTitles.titleAndSubtitle + "\u201C" + suffix;
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
            derive: function (_a) {
                var filePath = _a.filePath;
                return getPdfPageCount(filePath);
            },
            overwriteByDerived: true
        }
    }
};
/**
 * The meta data type specification “score”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var score = {
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
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var song = {
    title: 'Lied',
    props: {
        publicationDate: {
            wikidata: {
                // Veröffentlichungsdatum
                fromClaim: 'P577'
            },
            format: 'formatDate'
        },
        language: {
            wikidata: {
                // Sprache des Werks, Namens oder Begriffes
                fromClaim: 'P407',
                secondQuery: 'queryLabels'
            }
        },
        artist: {
            wikidata: {
                // Interpret
                fromClaim: 'P175',
                secondQuery: 'queryLabels'
            }
        },
        lyricist: {
            wikidata: {
                // Text von
                fromClaim: 'P676',
                secondQuery: 'queryLabels'
            }
        },
        genre: {
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
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var worksheet = {
    title: 'Arbeitsblatt',
    abbreviation: 'TX',
    detectTypeByPath: function () {
        return new RegExp('^.*/TX/.*.pdf$');
    },
    props: {
        title: {
            derive: function (_a) {
                var folderTitles = _a.folderTitles, filePath = _a.filePath;
                var match = filePath.match(new RegExp(path.sep + "([^" + path.sep + "]+)\\.pdf"));
                var baseName = match[1];
                return baseName + " zum Thema \u201E" + folderTitles.titleAndSubtitle + "\u201C";
            },
            overwriteByDerived: true
        },
        pageCount: {
            title: 'Seitenanzahl des PDFs',
            description: 'Die Seitenanzahl dieses PDFs',
            derive: function (_a) {
                var filePath = _a.filePath;
                return getPdfPageCount(filePath);
            },
            overwriteByDerived: true
        }
    }
};
/**
 * The meta data type specification “youtube”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var youtube = {
    title: 'YouTube-Video',
    abbreviation: 'YT',
    detectTypeByPath: function () {
        return new RegExp('^.*/YT/.*.mp4$');
    },
    relPath: function (_a) {
        var typeData = _a.typeData, typeSpec = _a.typeSpec, oldRelPath = _a.oldRelPath;
        var oldRelDir = path.dirname(oldRelPath);
        return path.join(oldRelDir, typeData.youtubeId + ".mp4");
    },
    props: {
        id: {
            derive: function (_a) {
                var typeData = _a.typeData, typeSpec = _a.typeSpec;
                return typeSpec.abbreviation + "_" + typeData.youtubeId;
            },
            overwriteByDerived: true
        },
        title: {
            derive: function (_a) {
                var typeData = _a.typeData;
                var title;
                if (typeData.heading) {
                    title = typeData.heading;
                }
                else if (typeData.originalHeading) {
                    title = typeData.originalHeading;
                }
                else {
                    title = typeData.youtubeId;
                }
                return "YouTube-Video \u201E" + title + "\u201C";
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
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
var general = {
    props: {
        id: {
            validate: function (value) {
                return value.match(/^[a-zA-Z0-9-_]+$/);
            },
            format: function (value, _a) {
                var typeData = _a.typeData, typeSpec = _a.typeSpec;
                value = idify(value);
                // a-Strawinsky-Petruschka-Abschnitt-0_22
                value = value.replace(/^[va]-/, '');
                if (typeData.filePath && typeData.metaTypes.indexOf('youtube') === -1) {
                    var idPrefix = generateIdPrefix(typeData.filePath);
                    if (idPrefix) {
                        if (value.indexOf(idPrefix) === -1) {
                            value = idPrefix + "_" + value;
                        }
                        // Avoid duplicate idPrefixes by changed prefixes:
                        // instead of:
                        // Piazzolla-Nonino_NB_Piazzolla-Adios-Nonino_NB_Adios-Nonino_melancolico
                        // old prefix: Piazzolla-Adios-Nonino_NB
                        // updated prefix: Piazzolla-Nonino_NB
                        // Preferred result: Piazzolla-Nonino_NB_Adios-Nonino_melancolico
                        // if (value.match(/.*_[A-Z]{2,}_.*/)) {
                        //   value = value.replace(/^.*_[A-Z]{2,}/, idPrefix)
                        // }
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
            derive: function () {
                return uuidv4();
            },
            overwriteByDerived: false
        },
        metaTypes: {
            title: 'Metadaten-Typen',
            description: 'Zum Beispiel: “person” oder “composition,recording”',
            validate: function (value) {
                return String(value).match(/^[a-zA-Z,]+$/);
            },
            format: function (value) {
                return value.replace(/,?general,?/, '');
            },
            removeByRegexp: new RegExp('^general$')
        },
        metaType: {
            description: 'Heißt jetzt “metaTypes”',
            state: 'absent'
        },
        title: {
            required: true,
            overwriteByDerived: false,
            format: function (value, _a) {
                var typeData = _a.typeData, typeSpec = _a.typeSpec;
                // a Strawinsky Petruschka Abschnitt 0_22
                value = value.replace(/^[va] /, '');
                return value;
            },
            derive: function (_a) {
                var typeData = _a.typeData;
                return deasciify(typeData.id);
            }
        },
        wikidata: {
            validate: function (value) {
                return String(value).match(/^Q\d+$/);
            }
        },
        wikipedia: {
            validate: function (value) {
                return value.match(/^.+:.+$/);
            },
            format: function (value, _a) {
                var typeData = _a.typeData, typeSpec = _a.typeSpec;
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
            state: 'absent'
        },
        // tmp propert: needed for wiki commons files.
        extension: {
            state: 'absent'
        }
    },
    finalize: function (_a) {
        var typeData = _a.typeData, typeSpec = _a.typeSpec;
        for (var propName in typeData) {
            var value = typeData[propName];
            if (typeof value === 'string') {
                typeData[propName] = value.trim();
            }
        }
        return typeData;
    }
};
module.exports = {
    cloze: cloze,
    composition: composition,
    cover: cover,
    group: group,
    instrument: instrument,
    person: person,
    photo: photo,
    radio: radio,
    recording: recording,
    reference: reference,
    score: score,
    song: song,
    worksheet: worksheet,
    youtube: youtube,
    // Applied to all
    general: general
};
