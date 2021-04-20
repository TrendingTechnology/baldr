import type { MediaCategory } from '@bldr/type-definitions'

import path from 'path'
import { idify } from '@bldr/core-browser'
import config from '@bldr/config'
import { validateDate } from '../main'

/**
 * The meta data type specification “group”.
 */
export const group: MediaCategory.Category = {
  title: 'Gruppe',
  abbreviation: 'GR',
  basePath: path.join(config.mediaServer.basePath, 'Gruppen'),
  relPath: function ({ data }) {
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
      format: function (value, { }) {
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
      format: function (value, { }) {
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
