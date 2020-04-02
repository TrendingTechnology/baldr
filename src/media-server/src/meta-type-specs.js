// Node packages.
const path = require('path')

// Project packages.
const { deasciify, idify } = require('./helper.js')
const { bootstrapConfig } = require('@bldr/core-node')
const { validateDate, validateUuid } = require('./meta-types.js')

/**
 * Generate a ID prefix for media assets, like `Presentation-ID_HB` if the
 * path of the media file is `10_Presentation-id/HB/example.mp3`.
 *
 * @param {String} filePath - The media asset file path.
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

        // HB_Ausstellung_Gnome -> Ausstellung_HB_Gnome
        value = value.replace(/^([A-Z]{2,})_([a-zA-Z0-9-]+)_/, '$2_$1_')
        return value
      },
      required: true
    },
    metaType: {
      validate: function (value) {
        return String(value).match(/^[a-zA-Z]+$/)
      }
    },
    title: {
      required: true,
      overwriteByDerived: false,
      format: function (value, { typeData, typeSpec }) {
        // a Strawinsky Petruschka Abschnitt 0_22
        value = value.replace(/^[va] /, '')
        return value
      },
      derive: function (typeData, typeSpec) {
        return deasciify(this.id)
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
  finalize: function (typeData, typeSpec) {
    for (const propName in typeData) {
      const value = typeData[propName]
      if (typeof value === 'string') {
        typeData[propName] = value.trim()
      }
    }
    return typeData
  }
}

const recording = {
  detectTypeByPath: new RegExp('^.*/HB/.*$'),
  props: {
    artist: {

    },
    musicbrainzRecordingId: {
      validate: validateUuid
    }
  }
}

const composition = {
  detectTypeByPath: new RegExp('^.*/HB/.*$'),
  props: {
    title: {
      // 'Tonart CD 4: Spur 29'
      removeByRegexp: /^.*CD.*Spur.*$/i
    },
    composer: {
      // Helbling-Verlag
      removeByRegexp: /^.*Verlag.*$/i
    },
    musicbrainzWorkId: {
      validate: validateUuid
    }
  }
}

const group = {
  abbreviation: 'GR',
  basePath: path.join(config.mediaServer.basePath, 'Gruppen'),
  relPath: function (typeData, typeSpec) {
    return path.join(this.id.substr(0, 1).toLowerCase(), this.id, `main.${this.extension}`)
  },
  detectTypeByPath: function (typeSpec) {
    return new RegExp('^' + typeSpec.basePath + '/.*')
  },
  props: {
    id: {
      derive: function (typeData, typeSpec) {
        return this.name
      },
      format: function (value, { typeData, typeSpec }) {
        value = value.replace(/^(The)[ -](.*)$/, '$2_$1')
        value = idify(value)
        return value
      },
      overwriteByDerived: false
    },
    title: {
      derive: function (typeData, typeSpec) {
        return `Portrait-Bild der Gruppe „${this.name}“`
      },
      overwriteByDerived: true
    },
    name: {
      required: true,
      wikidata: {
        // offizieller Name
        fromClaim: 'P1448'
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
        format: 'date'
      },
      validate: validateDate
    },
    endDate: {
      wikidata: {
        // Auflösungsdatum
        fromClaim: 'P576',
        format: 'date'
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
    wikipedia: {
      wikidata: {
        fromEntity: 'getWikipediaTitle'
      }
    },
    mainImage: {
      wikidata: {
        // Bild
        fromClaim: 'P18'
      }
    }
  }
}

const instrument = {
  abbreviation: 'IN',
  basePath: path.join(config.mediaServer.basePath, 'Instrumente'),
  relPath: function (typeData, typeSpec) {
    const id = this.id.replace(/^IN_/, '')
    return path.join(id.substr(0, 1).toLowerCase(), id, `main.${this.extension}`)
  },
  detectTypeByPath: function (typeSpec) {
    return new RegExp('^' + typeSpec.basePath + '/.*')
  },
  props: {
    id: {
      derive: function (typeData, typeSpec) {
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
      derive: function (typeData, typeSpec) {
        return `Foto des Instruments „${this.name}“`
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
        fromClaim: 'P18'
      }
    },
    playingRangeImage: {
      wikidata: {
        // Bild des Tonumfang
        fromClaim: 'P2343'
      }
    },
    wikipedia: {
      wikidata: {
        fromEntity: 'getWikipediaTitle'
      }
    }
  }
}

const person = {
  abbreviation: 'PR',
  basePath: path.join(config.mediaServer.basePath, 'Personen'),
  relPath: function () {
    return path.join(this.id.substr(0, 1).toLowerCase(), this.id, `main.${this.extension}`)
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
      derive: function (typeData, typeSpec) {
        return `${this.lastname}_${this.firstname}`
      },
      overwriteByDerived: false
    },
    title: {
      derive: function () {
        return `Portrait-Bild von „${this.firstname} ${this.lastname}“`
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
      derive: function (typeData, typeSpec) {
        return `${this.firstname} ${this.lastname}`
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
    wikipedia: {
      wikidata: {
        fromEntity: 'getWikipediaTitle',
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

const song = {
  props: {
    publicationDate: {
      wikidata: {
        // Veröffentlichungsdatum
        fromClaim: 'P577'
      },
      format: 'date'
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
    },
    wikipedia: {
      wikidata: {
        fromEntity: 'getWikipediaTitle'
      }
    }
  }
}

module.exports = {
  general,
  //recording,
  composition,
  group,
  instrument,
  person,
  song
}