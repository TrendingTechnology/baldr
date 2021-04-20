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

// Node packages.
import path from 'path'

// Third party packages.
import { v4 as uuidv4 } from 'uuid'

// Project packages.
import { getPdfPageCount } from '@bldr/core-node'
import { MediaUri, deasciify, idify } from '@bldr/core-browser'
import { MediaCategory } from '@bldr/type-definitions'
import config from '@bldr/config'

import { getTwoLetterAbbreviations, checkForTwoLetterDir } from './two-letter-abbreviations'

/**
 * Validate a date string in the format `yyyy-mm-dd`.
 */
function validateDate (value: string): boolean {
  return (value.match(/\d{4,}-\d{2,}-\d{2,}/) != null)
}

/**
 * Validate a ID string of the Baldr media server.
 */
function validateMediaId (value: string): boolean {
  return (value.match(MediaUri.regExp) != null)
}

/**
 * Validate UUID string (for the Musicbrainz references).
 */
function validateUuid (value: string): boolean {
  return (value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i) != null)
}

/**
 * Validate a YouTube ID.
 */
function validateYoutubeId (value: string): boolean {
  // https://webapps.stackexchange.com/a/101153
  return (value.match(/^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/) != null)
}

/**
 * Generate a ID prefix for media assets, like `Presentation-ID_HB` if the
 * path of the media file is `10_Presentation-id/HB/example.mp3`.
 *
 * @param filePath - The media asset file path.
 *
 * @returns The ID prefix.
 */
function generateIdPrefix (filePath: string): string | undefined {
  // We need the absolute path
  filePath = path.resolve(filePath)
  const pathSegments = filePath.split(path.sep)
  // HB
  const parentDir = pathSegments[pathSegments.length - 2]
  // Match asset type abbreviations, like AB, HB, NB
  if (parentDir.length !== 2 || (parentDir.match(/[A-Z]{2,}/) == null)) {
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
 * The meta data type specification “cloze”.
 */
const cloze: MediaCategory.Category = {
  title: 'Lückentext',
  abbreviation: 'LT',
  detectCategoryByPath: function () {
    return new RegExp('^.*/LT/.*.svg$')
  },
  initialize ({ data }) {
    if (data.filePath && !data.clozePageNo) {
      const match = data.filePath.match(/(\d+)\.svg/)
      if (match) data.clozePageNo = parseInt(match[1])
    }
    return data
  },
  relPath ({ data, category, oldRelPath }) {
    const oldRelDir = path.dirname(oldRelPath)
    let pageNo = ''
    if (data.clozePageNo) pageNo = `_${data.clozePageNo}`
    return path.join(oldRelDir, `Lueckentext${pageNo}.svg`)
  },
  props: {
    id: {
      title: 'Die ID des Lückentexts',
      derive: function ({ data, folderTitles, filePath }) {
        let counterSuffix = ''
        if (data.clozePageNo) {
          counterSuffix = `_${data.clozePageNo}`
        }
        return `${folderTitles.id}_LT${counterSuffix}`
      },
      overwriteByDerived: true
    },
    title: {
      title: 'Titel des Lückentextes',
      derive: function ({ data, folderTitles, filePath }) {
        let suffix = ''
        if (data.clozePageNo && data.clozePageCount) {
          suffix = ` (Seite ${data.clozePageNo} von ${data.clozePageCount})`
        } else if (data.clozePageNo && !data.clozePageCount) {
          suffix = ` (Seite ${data.clozePageNo})`
        }
        return `Lückentext zum Thema „${folderTitles.titleAndSubtitle}“${suffix}`
      },
      overwriteByDerived: true
    },
    clozePageNo: {
      title: 'Seitenzahl des Lückentextes',
      validate (value) {
        return Number.isInteger(value)
      }
    },
    clozePageCount: {
      title: 'Seitenanzahl des Lückentextes',
      validate (value) {
        return Number.isInteger(value)
      }
    }
  }
}

/**
 * The meta data type specification “composition”.
 */
const composition: MediaCategory.Category = {
  title: 'Komposition',
  detectCategoryByPath: new RegExp('^.*/HB/.*(m4a|mp3)$'),
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
}

/**
 * The meta data type specification “cover”.
 */
const cover: MediaCategory.Category = {
  title: 'Vorschau-Bild',
  detectCategoryByPath: new RegExp('^.*/HB/.*(png|jpg)$'),
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
 */
const group: MediaCategory.Category = {
  title: 'Gruppe',
  abbreviation: 'GR',
  basePath: path.join(config.mediaServer.basePath, 'Gruppen'),
  relPath: function ({ data, category }) {
    return path.join(data.groupId.substr(0, 1).toLowerCase(), data.groupId, `main.${data.extension}`)
  },
  detectCategoryByPath: function (category) {
    return new RegExp('^' + category.basePath + '/.*')
  },
  props: {
    groupId: {
      title: 'Gruppen-ID',
      derive: function ({ data }) {
        return data.name
      },
      format: function (value, { data, category }) {
        value = value.replace(/^(The)[ -](.*)$/, '$2_$1')
        value = idify(value)
        return value
      },
      overwriteByDerived: true
    },
    id: {
      title: 'ID zur Referenzierung (Präfix „GR_“)',
      derive: function ({ data }) {
        return data.name
      },
      format: function (value, { data, category }) {
        value = value.replace(/^(The)[ -](.*)$/, '$2_$1')
        value = idify(value)
        return `GR_${value}`
      },
      overwriteByDerived: true
    },
    title: {
      title: 'Titel der Gruppe',
      derive: function ({ data }) {
        return `Portrait-Bild der Gruppe „${data.name}“`
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
        return Array.isArray(value)
      }
    }
  }
}

/**
 * The meta data type specification “instrument”.
 */
const instrument: MediaCategory.Category = {
  title: 'Instrument',
  abbreviation: 'IN',
  basePath: path.join(config.mediaServer.basePath, 'Instrumente'),
  relPath: function ({ data, category }) {
    const id = data.id.replace(/^IN_/, '')
    return path.join(id.substr(0, 1).toLowerCase(), id, `main.${data.extension}`)
  },
  detectCategoryByPath: function (category) {
    return new RegExp(`^${category.basePath}.*/main\\.jpg$`)
  },
  props: {
    instrumentId: {
      title: 'Instrumenten-ID',
      derive: function ({ data }) {
        return idify(data.name)
      }
    },
    id: {
      title: 'ID zur Referenzierung (Präfix „IN_“)',
      derive: function ({ data, category }) {
        // IS: Instrument
        return `${category.abbreviation}_${idify(data.name)}`
      },
      overwriteByDerived: true
    },
    title: {
      title: 'Titel des Instruments',
      derive: function ({ data }) {
        return `Foto des Instruments „${data.name}“`
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
}

/**
 * The meta data type specification “person”.
 */
const person: MediaCategory.Category = {
  title: 'Person',
  abbreviation: 'PR',
  basePath: path.join(config.mediaServer.basePath, 'Personen'),
  relPath: function ({ data }) {
    return path.join(data.personId.substr(0, 1).toLowerCase(), data.personId, `main.${data.extension}`)
  },
  detectCategoryByPath: function (category) {
    return new RegExp('^' + category.basePath + '/.*(jpg|png)')
  },
  normalizeWikidata: function ({ data, entity, functions }) {
    const label = functions.getLabel(entity)
    const segments = label.split(' ')
    const firstnameFromLabel = segments.shift()
    const lastnameFromLabel = segments.pop()
    // Use the label by artist names.
    // for example „Joan Baez“ and not „Joan Chandos“
    if (
      firstnameFromLabel && lastnameFromLabel &&
      (data.firstname !== firstnameFromLabel || data.lastname !== lastnameFromLabel)
    ) {
      data.firstname = firstnameFromLabel
      data.lastname = lastnameFromLabel
      data.name = label
    }
    return data
  },
  props: {
    personId: {
      title: 'Personen-ID',
      derive: function ({ data }) {
        return `${idify(data.lastname)}_${idify(data.firstname)}`
      },
      overwriteByDerived: true
    },
    id: {
      title: 'ID der Person',
      derive: function ({ data, category }) {
        return `${category.abbreviation}_${idify(data.lastname)}_${idify(data.firstname)}`
      },
      overwriteByDerived: true
    },
    title: {
      title: 'Titel der Person',
      derive: function ({ data }) {
        return `Portrait-Bild von „${data.firstname} ${data.lastname}“`
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
            return value.join(' ')
          }
          return value
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
            return value.join(' ')
          }
          return value
        }
      }
    },
    name: {
      title: 'Name (Vor- und Familienname)',
      derive: function ({ data }) {
        return `${data.firstname} ${data.lastname}`
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
        return Array.isArray(value)
      }
    },
    wikicommons: {
      title: 'Wikicommons',
      state: 'absent'
    }
  }
}

/**
 * The meta data type specification “photo”.
 */
const photo: MediaCategory.Category = {
  title: 'Foto',
  abbreviation: 'FT',
  detectCategoryByPath: function () {
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
 */
const radio: MediaCategory.Category = {
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
 */
const recording: MediaCategory.Category = {
  title: 'Aufnahme',
  detectCategoryByPath: new RegExp('^.*/HB/.*(m4a|mp3)$'),
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
      validate (value) {
        return value.match(/^https?.*$/)
      }
    }
  }
}

/**
 * The meta data type specification “reference”.
 */
const reference: MediaCategory.Category = {
  title: 'Quelle',
  description: 'Quelle, auf der eine Unterrichtsstunde aufbaut, z. B. Auszüge aus Schulbüchern.',
  detectCategoryByPath: function () {
    return new RegExp('^.*/QL/.*.pdf$')
  },
  abbreviation: 'QL',
  props: {
    title: {
      title: 'Titel der Quelle',
      derive: function ({ data, folderTitles, filePath }) {
        let suffix = ''
        if (data.forTeacher) {
          suffix = ' (Lehrerband)'
        }
        return `Quelle zum Thema „${folderTitles.titleAndSubtitle}“${suffix}`
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
      derive ({ filePath }) {
        return getPdfPageCount(filePath)
      },
      overwriteByDerived: true
    }
  }
}

/**
 * The meta data type specification “score”.
 */
const score: MediaCategory.Category = {
  title: 'Partitur',
  abbreviation: 'PT',
  detectCategoryByPath: function () {
    return new RegExp('^.*/PT/.*.pdf$')
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
}

/**
 * The meta data type specification “song”.
 */
const song: MediaCategory.Category = {
  title: 'Lied',
  props: {
    publicationDate: {
      title: 'Veröffentlichungsdatum',
      wikidata: {
        // Veröffentlichungsdatum
        fromClaim: 'P577',
        format: 'formatDate'
      }
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
}

/**
 * The meta data type specification “worksheet”.
 */
const worksheet: MediaCategory.Category = {
  title: 'Arbeitsblatt',
  abbreviation: 'TX',
  detectCategoryByPath: function () {
    return new RegExp('^.*/TX/.*.pdf$')
  },
  props: {
    title: {
      title: 'Titel',
      derive: function ({ folderTitles, filePath }) {
        const match = filePath.match(new RegExp(`${path.sep}([^${path.sep}]+)\\.pdf`))
        let baseName: string = 'Arbeitsblatt'
        if (match != null) {
          baseName = match[1]
        }
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
 * The meta data type specification “youtube”.
 */
const youtube: MediaCategory.Category = {
  title: 'YouTube-Video',
  abbreviation: 'YT',
  detectCategoryByPath: function () {
    return new RegExp('^.*/YT/.*.mp4$')
  },
  relPath ({ data, category, oldRelPath }) {
    const oldRelDir = path.dirname(oldRelPath)
    return path.join(oldRelDir, `${data.youtubeId}.mp4`)
  },
  props: {
    id: {
      title: 'ID eines YouTube-Videos',
      derive: function ({ data, category }) {
        return `${category.abbreviation}_${data.youtubeId}`
      },
      overwriteByDerived: true
    },
    title: {
      title: 'Titel eines YouTube-Videos',
      derive: function ({ data }) {
        let title
        if (data.heading) {
          title = data.heading
        } else if (data.originalHeading) {
          title = data.originalHeading
        } else {
          title = data.youtubeId
        }
        return `YouTube-Video „${title}“`
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
}

/**
 * General meta data type specification. Applied after all other meta data
 * types.
 */
const general: MediaCategory.Category = {
  title: 'Allgemeiner Metadaten-Type',
  props: {
    id: {
      title: 'ID',
      validate: function (value) {
        return value.match(/^[a-zA-Z0-9-_]+$/)
      },
      format: function (value, { data, category }) {
        let raw = idify(value)

        // a-Strawinsky-Petruschka-Abschnitt-0_22
        raw = raw.replace(/^[va]-/, '')

        if (data.filePath != null && !data.categories!.includes('youtube')) {
          const idPrefix = generateIdPrefix(data.filePath)
          if (idPrefix != null) {
            if (!raw.includes(idPrefix)) {
              raw = `${idPrefix}_${raw}`
            }

            // Avoid duplicate idPrefixes by changed prefixes:
            // instead of:
            // Piazzolla-Nonino_NB_Piazzolla-Adios-Nonino_NB_Adios-Nonino_melancolico
            // old prefix: Piazzolla-Adios-Nonino_NB
            // updated prefix: Piazzolla-Nonino_NB
            // Preferred result: Piazzolla-Nonino_NB_Adios-Nonino_melancolico
            const twoLetterRegExp = '(' + getTwoLetterAbbreviations().join('|') + ')'
            if (raw.match(new RegExp(`.*_${twoLetterRegExp}_.*`)) != null) {
              raw = raw.replace(new RegExp(`^.*_${twoLetterRegExp}`), idPrefix)
            }
          }
        }

        // Disabled for example GR_Beatles_The != Beatles_GR_The
        // HB_Ausstellung_Gnome -> Ausstellung_HB_Gnome
        // value = value.replace(/^([A-Z]{2,})_([a-zA-Z0-9-]+)_/, '$2_$1_')
        return raw
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
    categories: {
      title: 'Metadaten-Kategorien',
      description: 'Zum Beispiel: “person” oder “composition,recording”',
      validate: function (value) {
        return (String(value).match(/^[a-zA-Z,]+$/) != null)
      },
      format: function (value) {
        return value.replace(/,?general,?/, '')
      },
      removeByRegexp: new RegExp('^general$')
    },
    metaType: {
      title: 'Metadaten-Type',
      description: 'Heißt jetzt “metaTypes”',
      state: 'absent'
    },
    metaTypes: {
      title: 'Metadaten-Type',
      description: 'Heißt jetzt “categories”',
      state: 'absent'
    },
    title: {
      title: 'Titel',
      required: true,
      overwriteByDerived: false,
      format: function (value, { data, category }) {
        // a Strawinsky Petruschka Abschnitt 0_22
        value = value.replace(/^[va] /, '')
        return value
      },
      derive: function ({ data }) {
        return deasciify(data.id)
      }
    },
    wikidata: {
      title: 'Wikidata',
      validate: function (value) {
        return (String(value).match(/^Q\d+$/) != null)
      }
    },
    wikipedia: {
      title: 'Wikipedia',
      validate: function (value) {
        return value.match(/^.+:.+$/)
      },
      format: function (value, { data, category }) {
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
  initialize: function ({ data }) {
    if (data.filePath != null && !checkForTwoLetterDir(data.filePath)) {
      console.log(`File path ${data.filePath} is not in a valid two letter directory.`)
      process.exit()
    }
    return data
  },
  finalize: function ({ data }) {
    for (const propName in data) {
      const value = data[propName]
      if (typeof value === 'string') {
        data[propName] = value.trim()
      }
    }
    return data
  }
}

export default {
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
}
