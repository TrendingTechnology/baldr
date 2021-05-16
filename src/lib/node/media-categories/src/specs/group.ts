import path from 'path'

import type { MediaCategory, AssetType } from '@bldr/type-definitions'
import { referencify } from '@bldr/core-browser'
import config from '@bldr/config'

import { validateDate } from '../main'

interface GroupCategory extends MediaCategory.Category {
  abbreviation: string
  basePath: string
}

interface GroupFileFormat extends AssetType.YamlFormat {
  groupId: string
  name: string
  extension: string
}

/**
 * The meta data type specification “group”.
 */
export const group: MediaCategory.Category = {
  title: 'Gruppe',
  abbreviation: 'GR',
  basePath: path.join(config.mediaServer.basePath, 'Gruppen'),
  relPath: function ({ data }) {
    const groupData = data as GroupFileFormat
    return path.join(groupData.groupId.substr(0, 1).toLowerCase(), groupData.groupId, `main.${groupData.extension}`)
  },
  detectCategoryByPath: function (category) {
    const groupCategory = category as GroupCategory
    return new RegExp('^' + groupCategory.basePath + '/.*')
  },
  props: {
    groupId: {
      title: 'Gruppen-ID',
      derive: function ({ data }) {
        return data.name
      },
      format: function (value) {
        value = value.replace(/^(The)[ -](.*)$/, '$2_$1')
        value = referencify(value)
        return value
      },
      overwriteByDerived: true
    },
    ref: {
      title: 'ID zur Referenzierung (Präfix „GR_“)',
      derive: function ({ data }) {
        return data.name
      },
      format: function (value) {
        value = value.replace(/^(The)[ -](.*)$/, '$2_$1')
        return `GR_${referencify(value)}`
      },
      overwriteByDerived: true
    },
    title: {
      title: 'Titel der Gruppe',
      derive: function ({ data }) {
        const groupData = data as GroupFileFormat
        return `Portrait-Bild der Gruppe „${groupData.name}“`
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
