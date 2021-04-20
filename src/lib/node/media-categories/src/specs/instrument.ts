import type { MediaCategory } from '@bldr/type-definitions'

import path from 'path'
import { idify } from '@bldr/core-browser'
import config from '@bldr/config'

/**
 * The meta data type specification “instrument”.
 */
export const instrument: MediaCategory.Category = {
  title: 'Instrument',
  abbreviation: 'IN',
  basePath: path.join(config.mediaServer.basePath, 'Instrumente'),
  relPath: function ({ data }) {
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
