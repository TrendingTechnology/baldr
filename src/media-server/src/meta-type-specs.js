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
const path = require('path')

// Third party packages.
const { v4: uuidv4 } = require('uuid');

// Project packages.
const { deasciify, idify } = require('./helper.js')
const { bootstrapConfig, getPdfPageCount } = require('@bldr/core-node')
const { mediaUriRegExp } = require('@bldr/core-browser')

/**
 * Validate a date string in the format `yyyy-mm-dd`.
 *
 * @param {String} value
 *
 * @returns {Boolean}
 */
function validateDate (value) {
  return value.match(/\d{4,}-\d{2,}-\d{2,}/)
}

/**
 * Validate a ID string of the Baldr media server.
 *
 * @param {String} value
 *
 * @returns {Boolean}
 */
function validateMediaId (value) {
  return value.match(mediaUriRegExp)
}

/**
 * Validate UUID string (for the Musicbrainz references).
 *
 * @param {String} value
 *
 * @returns {Boolean}
 */
function validateUuid (value) {
  return value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i)
}

/**
 * Generate a ID prefix for media assets, like `Presentation-ID_HB` if the
 * path of the media file is `10_Presentation-id/HB/example.mp3`.
 *
 * @param {String} filePath - The media asset file path.
 *
 * @returns {String} the ID prefix.
 */
function generateIdPrefix (filePath) {
  // We need the absolute path
  filePath = path.resolve(filePath)
  const pathSegments = filePath.split(path.sep)
  // HB
  const parentDir = pathSegments[pathSegments.length - 2]
  // Match asset type abbreviations, like AB, HB, NB
  if (parentDir.length !== 2 || !parentDir.match(/[A-Z]{2,}/)) {
    return
  }
  const assetTypeAbbreviation = parentDir
  // 20_Strawinsky-Petruschka
  const subParentDir = pathSegments[pathSegments.length - 3]
  // Strawinsky-Petruschka
  const presentationId = subParentDir.replace(/^[0-9]{2,}_/, '')
  // Strawinsky-Petruschka_HB
  const idPrefix = `${presentationId}_${assetTypeAbbreviation}`
  return idPrefix
}

/**
 * The configuration object from `/etc/baldr.json`
 */
const config = bootstrapConfig()

/**
 * The meta data type specification “cloze”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const cloze = {
  title: 'Lückentext',
  abbreviation: 'LT',
  detectTypeByPath: function () {
    return new RegExp('^.*/LT/.*.svg$')
  },
  initialize ({ typeData }) {
    if (typeData.filePath && !typeData.clozePageNo) {
      const match = typeData.filePath.match(/(\d+)\.svg/)
      if (match) typeData.clozePageNo = parseInt(match[1])
    }
    return typeData
  },
  relPath ({ typeData, typeSpec, oldRelPath }) {
    console.log('lol')
    const oldRelDir = path.dirname(oldRelPath)
    let pageNo = ''
    if (typeData.clozePageNo) pageNo = `_${typeData.clozePageNo}`
    return path.join(oldRelDir, `Lueckentext${pageNo}.svg`)
  },
  props: {
    id: {
      derive: function ({ typeData, folderTitles, filePath }) {
        let counterSuffix = ''
        if (typeData.clozePageNo) {
          counterSuffix = `_${typeData.clozePageNo}`
        }
        return `${folderTitles.id}_LT${counterSuffix}`
      },
      overwriteByDerived: true
    },
    title: {
      derive: function ({ typeData, folderTitles, filePath }) {
        let suffix = ''
        if (typeData.clozePageNo && typeData.clozePageCount) {
          suffix = ` (Seite ${typeData.clozePageNo} von ${typeData.clozePageCount})`
        } else if (typeData.clozePageNo && !typeData.clozePageCount) {
          suffix = ` (Seite ${typeData.clozePageNo})`
        }
        return `Lückentext zum Thema „${folderTitles.title}“${suffix}`
      },
      overwriteByDerived: true
    },
    clozePageNo: {
      validate (value) {
        return Number.isInteger(value)
      }
    },
    clozePageCount: {
      validate (value) {
        return Number.isInteger(value)
      }
    }
  }
}

/**
 * The meta data type specification “composition”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const composition = {
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
}

/**
 * The meta data type specification “cover”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const cover = {
  detectTypeByPath: new RegExp('^.*/HB/.*(png|jpg)$'),
  props: {
    title: {
      title: 'Titel',
      format: function (value) {
        return value.replace(/^(Cover-Bild: )?/, 'Cover-Bild: ')
      }
    },
    source: {
      title: 'Quelle (HTTP-URL)',
      validate (value) {
        return value.match(/^https?.*$/)
      }
    }
  }
}

/**
 * The meta data type specification “group”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const group = {
  title: 'Gruppe',
  abbreviation: 'GR',
  basePath: path.join(config.mediaServer.basePath, 'Gruppen'),
  relPath: function ({ typeData, typeSpec }) {
    return path.join(typeData.id.substr(0, 1).toLowerCase(), typeData.id, `main.${typeData.extension}`)
  },
  detectTypeByPath: function (typeSpec) {
    return new RegExp('^' + typeSpec.basePath + '/.*')
  },
  props: {
    groupId: {
      title: 'Gruppen-ID',
      derive: function ({ typeData }) {
        return typeData.name
      },
      format: function (value, { typeData, typeSpec }) {
        value = value.replace(/^(The)[ -](.*)$/, '$2_$1')
        value = idify(value)
        return value
      },
      overwriteByDerived: true
    },
    id: {
      title: 'ID zur Referenzierung (Präfix „GR_“)',
      derive: function ({ typeData }) {
        return typeData.name
      },
      format: function (value, { typeData, typeSpec }) {
        value = value.replace(/^(The)[ -](.*)$/, '$2_$1')
        value = idify(value)
        return `GR_${value}`
      },
      overwriteByDerived: true
    },
    title: {
      title: 'Titel der Gruppe',
      derive: function ({ typeData }) {
        return `Portrait-Bild der Gruppe „${typeData.name}“`
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
      wikidata: {
        // Logo
        fromClaim: 'P154',
        format: 'formatWikicommons'
      }
    },
    shortHistory: {
      wikidata: {
        fromEntity: 'getDescription'
      }
    },
    startDate: {
      wikidata: {
        // Gründung, Erstellung bzw. Entstehung
        fromClaim: 'P571',
        format: 'formatDate'
      },
      validate: validateDate
    },
    endDate: {
      wikidata: {
        // Auflösungsdatum
        fromClaim: 'P576',
        format: 'formatDate'
      },
      validate: validateDate
    },
    members: {
      wikidata: {
        // besteht aus
        fromClaim: 'P527',
        secondQuery: 'queryLabels'
      }
    },
    mainImage: {
      wikidata: {
        // Bild
        fromClaim: 'P18',
        format: 'formatWikicommons'
      }
    }
  }
}

/**
 * The meta data type specification “instrument”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const instrument = {
  title: 'Instrument',
  abbreviation: 'IN',
  basePath: path.join(config.mediaServer.basePath, 'Instrumente'),
  relPath: function ({ typeData, typeSpec }) {
    const id = typeData.id.replace(/^IN_/, '')
    return path.join(id.substr(0, 1).toLowerCase(), id, `main.${typeData.extension}`)
  },
  detectTypeByPath: function (typeSpec) {
    return new RegExp('^' + typeSpec.basePath + '/.*main\.jpg^')
  },
  props: {
    id: {
      derive: function ({ typeData, typeSpec }) {
        // IS: Instrument
        return `${typeSpec.abbreviation}_${typeData.name}`
      },
      format: function (value, { typeData, typeSpec }) {
        value = value.replace(/_BD$/, '')
        return value
      },
      overwriteByDerived: true
    },
    title: {
      derive: function ({ typeData }) {
        return `Foto des Instruments „${typeData.name}“`
      },
      overwriteByDerived: true
    },
    name: {
      wikidata: {
        fromEntity: 'getLabel'
      },
      required: true
    },
    description: {
      wikidata: {
        fromEntity: 'getDescription'
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
    }
  }
}

/**
 * The meta data type specification “person”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const person = {
  title: 'Person',
  abbreviation: 'PR',
  basePath: path.join(config.mediaServer.basePath, 'Personen'),
  relPath: function ({ typeData, typeSpec }) {
    return path.join(typeData.id.substr(0, 1).toLowerCase(), typeData.id, `main.${typeData.extension}`)
  },
  detectTypeByPath: function (typeSpec) {
    return new RegExp('^' + typeSpec.basePath + '/.*')
  },
  normalizeWikidata: function ({ typeData, entity, functions }) {
    const label = functions.getLabel(entity)
    const segments = label.split(' ')
    const firstnameFromLabel = segments.shift()
    const lastnameFromLabel = segments.pop()
    // Use the label by artist names.
    // for example „Joan Baez“ and not „Joan Chandos“
    if (
      firstnameFromLabel && lastnameFromLabel &&
      (typeData.firstname !== firstnameFromLabel || typeData.lastname !== lastnameFromLabel)
    ) {
      typeData.firstname = firstnameFromLabel
      typeData.lastname = lastnameFromLabel
      typeData.name = label
    }
    return typeData
  },
  props: {
    id: {
      derive: function ({ typeData }) {
        return `${typeData.lastname}_${typeData.firstname}`
      },
      overwriteByDerived: false
    },
    title: {
      derive: function ({ typeData }) {
        return `Portrait-Bild von „${typeData.firstname} ${typeData.lastname}“`
      },
      overwriteByDerived: true
    },
    firstname: {
      required: true,
      wikidata: {
        // Vornamen der Person
        fromClaim: 'P735',
        secondQuery: 'queryLabels',
        format: function (value, { typeData, typeSpec }) {
          if (Array.isArray(value)) {
            return value.join(' ')
          }
          return value
        }
      }
    },
    lastname: {
      required: true,
      wikidata: {
        // Familienname einer Person
        fromClaim: 'P734',
        secondQuery: 'queryLabels',
        format: function (value, { typeData, typeSpec }) {
          if (Array.isArray(value)) {
            return value.join(' ')
          }
          return value
        }
      }
    },
    name: {
      derive: function ({ typeData }) {
        return `${typeData.firstname} ${typeData.lastname}`
      },
      overwriteByDerived: false
    },
    shortBiography: {
      required: true,
      wikidata: {
        fromEntity: 'getDescription'
      }
    },
    birth: {
      validate: validateDate,
      wikidata: {
        // Geburtsdatum
        fromClaim: 'P569',
        format: 'formatDate',
        alwaysUpdate: true
      }
    },
    death: {
      validate: validateDate,
      wikidata: {
        // Sterbedatum
        fromClaim: 'P570',
        format: 'formatDate',
        alwaysUpdate: true
      }
    },
    mainImage: {
      wikidata: {
        // Bild
        fromClaim: 'P18',
        format: 'formatWikicommons'
      }
    }
  }
}

/**
 * The meta data type specification “photo”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const photo = {
  title: 'Foto',
  abbreviation: 'FT',
  detectTypeByPath: function () {
    return new RegExp('^.*/FT/.*.jpg$')
  },
  props: {
    photographer: {
      title: 'Fotograph*in'
    }
  }
}

/**
 * The meta data type specification “radio”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const radio = {
  title: 'Schulfunk',
  abbreviation: 'SF',
  props: {
    author: {
      title: 'Autor*in'
    }
  }
}

/**
 * The meta data type specification “recording”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const recording = {
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
      validate (value) {
        return value.match(/^https?.*$/)
      }
    }
  }
}

/**
 * The meta data type specification “reference”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const reference = {
  title: 'Quelle',
  description: 'Quelle, auf der eine Unterrichtsstunde aufbaut, z. B. Auszüge aus Schulbüchern.',
  detectTypeByPath: function () {
    return new RegExp('^.*/QL/.*.pdf$')
  },
  abbreviation: 'QL',
  props: {
    title: {
      derive: function ({ typeData, folderTitles, filePath }) {
        let suffix = ''
        if (typeData.forTeacher) {
          suffix = ` (Lehrerband)`
        }
        return `Quelle zum Thema „${folderTitles.titleAndSubtitle}“${suffix}`
      },
      overwriteByDerived: true
    },
    referenceTitle: {
      title: 'Title der (übergeordneten Quelle)'
    },
    author: {
      title: 'Autor'
    },
    publisher: {
      title: 'Verlag'
    },
    releaseData: {
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
      derive ({ filePath }) {
        return getPdfPageCount(filePath)
      },
      overwriteByDerived: true
    }
  }
}

/**
 * The meta data type specification “song”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const song = {
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
}

/**
 * The meta data type specification “worksheet”.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const worksheet = {
  title: 'Arbeitsblatt',
  abbreviation: 'TX',
  detectTypeByPath: function () {
    return new RegExp('^.*/TX/.*.pdf$')
  },
  props: {
    title: {
      derive: function ({ folderTitles, filePath }) {
        const match = filePath.match(new RegExp(path.sep + '([^' + path.sep + ']+)\.pdf'))
        const baseName = match[1]
        return `${baseName} zum Thema „${folderTitles.titleAndSubtitle}“`
      },
      overwriteByDerived: true
    },
    pageCount: {
      title: 'Seitenanzahl des PDFs',
      description: 'Die Seitenanzahl dieses PDFs',
      derive ({ filePath }) {
        return getPdfPageCount(filePath)
      },
      overwriteByDerived: true
    }
  }
}

/**
 * General meta data type specification. Applied after all other meta data
 * types.
 *
 * @type {module:@bldr/media-server/meta-types~typeSpec}
 */
const general = {
  props: {
    id: {
      validate: function (value) {
        return value.match(/^[a-zA-Z0-9-_]+$/)
      },
      format: function (value, { typeData, typeSpec }) {
        value = idify(value)

        // a-Strawinsky-Petruschka-Abschnitt-0_22
        value = value.replace(/^[va]-/, '')

        if (typeData.filePath) {
          const idPrefix = generateIdPrefix(typeData.filePath)
          if (idPrefix) {
            if (value.indexOf(idPrefix) === -1) {
              value = `${idPrefix}_${value}`
            }

            // Avoid duplicate idPrefixes by changed prefixes:
            // instead of:
            // Piazzolla-Nonino_NB_Piazzolla-Adios-Nonino_NB_Adios-Nonino_melancolico
            // old prefix: Piazzolla-Adios-Nonino_NB
            // updated prefix: Piazzolla-Nonino_NB
            // Preferred result: Piazzolla-Nonino_NB_Adios-Nonino_melancolico
            if (value.match(/.*_[A-Z]{2,}_.*/)) {
              value = value.replace(/^.*_[A-Z]{2,}/, idPrefix)
            }
          }
        }

        // Disabled for example GR_Beatles_The != Beatles_GR_The
        // HB_Ausstellung_Gnome -> Ausstellung_HB_Gnome
        // value = value.replace(/^([A-Z]{2,})_([a-zA-Z0-9-]+)_/, '$2_$1_')
        return value
      },
      required: true
    },
    uuid: {
      title: 'UUID',
      description: 'UUID version 4.',
      derive () {
        return uuidv4()
      },
      overwriteByDerived: false
    },
    metaTypes: {
      title: 'Metadaten-Typen',
      description: 'Zum Beispiel: “person” oder “composition,recording”',
      validate: function (value) {
        return String(value).match(/^[a-zA-Z,]+$/)
      },
      format: function (value) {
        return value.replace(/,?general,?/, '')
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
      format: function (value, { typeData, typeSpec }) {
        // a Strawinsky Petruschka Abschnitt 0_22
        value = value.replace(/^[va] /, '')
        return value
      },
      derive: function ({ typeData }) {
        return deasciify(typeData.id)
      }
    },
    wikidata: {
      validate: function (value) {
        return String(value).match(/^Q\d+$/)
      }
    },
    wikipedia: {
      validate: function (value) {
        return value.match(/^.+:.+$/)
      },
      format: function (value, { typeData, typeSpec }) {
        return decodeURI(value)
      },
      wikidata: {
        fromEntity: 'getWikipediaTitle',
        alwaysUpdate: true
      }
    },
    youtube: {
      title: 'Youtube-Video-ID',
      description: 'Die Youtube-Video-ID',
      validate: function (value) {
        // https://webapps.stackexchange.com/a/101153
        return value.match(/^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/)
      },
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
  finalize: function ({ typeData, typeSpec }) {
    for (const propName in typeData) {
      const value = typeData[propName]
      if (typeof value === 'string') {
        typeData[propName] = value.trim()
      }
    }
    return typeData
  }
}

module.exports = {
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
  song,
  worksheet,
  // Applied to all
  general
}
