import type { MediaCategoriesTypes } from '@bldr/type-definitions'
import { deasciify, referencify, genUuid } from '@bldr/core-browser'
import { getTwoLetterRegExp, checkForTwoLetterDir } from '../two-letter-abbreviations'

import { generateIdPrefix, validateYoutubeId } from '../main'

/**
 * General meta data type specification. Applied after all other meta data
 * types.
 */
export const general: MediaCategoriesTypes.Category = {
  title: 'Allgemeiner Metadaten-Type',
  props: {
    ref: {
      title: 'Referenz',
      validate: function (value) {
        return value.match(/^[a-zA-Z0-9-_]+$/)
      },
      format: function (value, { data, filePath }) {
        let raw = referencify(value)

        // a-Strawinsky-Petruschka-Abschnitt-0_22
        raw = raw.replace(/^[va]-/, '')

        // eslint-disable-next-line
        if (filePath != null && !data.categories?.includes('youtube')) {
          const idPrefix = generateIdPrefix(filePath)
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
            const twoLetterRegExp = getTwoLetterRegExp()
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
        return genUuid()
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
      description: 'Heißt jetzt “categories”',
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
      format: function (value) {
        // a Strawinsky Petruschka Abschnitt 0_22
        value = String(value).replace(/^[va] /, '')
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
      format: function (value) {
        return decodeURI(value)
      },
      wikidata: {
        fromEntity: 'getWikipediaTitle',
        alwaysUpdate: true
      }
    },
    wikicommons: {
      title: 'Wikicommons'
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
    description: {
      title: 'Beschreibung'
    },
    source: {
      title: 'Quelle'
    },
    partOf: {
      title: 'Teil eines übergeordneten Werks'
    },
    shortcut: {
      title: 'Tastenkürzel'
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
  initialize: function ({ data, filePath }) {
    if (filePath != null && !checkForTwoLetterDir(filePath)) {
      console.log(`File path ${filePath} is not in a valid two letter directory.`)
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
