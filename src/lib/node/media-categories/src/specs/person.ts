import path from 'path'

import type { MediaCategory, AssetType } from '@bldr/type-definitions'
import { idify } from '@bldr/core-browser'
import config from '@bldr/config'

import { validateDate } from '../main'

interface PersonFileFormat extends AssetType.FileFormat {
  firstname: string
  lastname: string
  personId: string
  extension: string
}

interface PersonCategory extends MediaCategory.Category {
  abbreviation: string
  basePath: string
}

/**
 * The meta data type specification “person”.
 */
export const person: MediaCategory.Category = {
  title: 'Person',
  abbreviation: 'PR',
  basePath: path.join(config.mediaServer.basePath, 'Personen'),
  relPath: function ({ data }) {
    const personData = data as PersonFileFormat
    return path.join(personData.personId.substr(0, 1).toLowerCase(), personData.personId, `main.${personData.extension}`)
  },
  detectCategoryByPath: function (category) {
    const personCategory = category as PersonCategory
    return new RegExp('^' + personCategory.basePath + '/.*(jpg|png)')
  },
  normalizeWikidata: function ({ data, entity, functions }) {
    const label = functions.getLabel(entity)
    const segments = label.split(' ')
    const firstnameFromLabel = segments.shift()
    const lastnameFromLabel = segments.pop()
    // Use the label by artist names.
    // for example „Joan Baez“ and not „Joan Chandos“
    if (
      firstnameFromLabel != null && lastnameFromLabel != null &&
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
    ref: {
      title: 'ID der Person',
      derive: function ({ data, category }) {
        const personCategory = category as PersonCategory
        return `${personCategory.abbreviation}_${idify(data.lastname)}_${idify(data.firstname)}`
      },
      overwriteByDerived: true
    },
    title: {
      title: 'Titel der Person',
      derive: function ({ data }) {
        const personData = data as PersonFileFormat
        return `Portrait-Bild von „${personData.firstname} ${personData.lastname}“`
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
        format: function (value) {
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
        const personData = data as PersonFileFormat
        return `${personData.firstname} ${personData.lastname}`
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
