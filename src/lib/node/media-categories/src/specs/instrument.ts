import path from 'path'

import { referencify } from '@bldr/core-browser'
import {
  MediaCategoriesTypes,
  MediaResolverTypes
} from '@bldr/type-definitions'
import { getConfig } from '@bldr/config-ng'

const config = getConfig()
interface InstrumentCategory extends MediaCategoriesTypes.Category {
  abbreviation: string
  basePath: string
}

interface InstrumentFileFormat extends MediaResolverTypes.YamlFormat {
  name: string
  extension: string
}

function check (data: any): void {
  if (data.name == null) {
    throw new Error('A instrument needs a name.')
  }
}

/**
 * The meta data type specification “instrument”.
 */
export const instrument: MediaCategoriesTypes.Category = {
  title: 'Instrument',
  abbreviation: 'IN',
  basePath: path.join(config.mediaServer.basePath, 'Musik', 'Instrumente'),
  relPath: function ({ data }) {
    const instrumentData = data as InstrumentFileFormat
    const id = data.instrumentId.replace(/^IN_/, '')
    return path.join(
      id.substr(0, 1).toLowerCase(),
      id,
      `main.${instrumentData.extension}`
    )
  },
  detectCategoryByPath: function (category) {
    const instrumentCategory = category as InstrumentCategory
    return new RegExp(`^${instrumentCategory.basePath}.*/main\\.jpg$`)
  },
  props: {
    instrumentId: {
      title: 'Instrumenten-ID',
      derive: function ({ data }) {
        return referencify(data.name)
      }
    },
    ref: {
      title: 'ID zur Referenzierung (Präfix „IN_“)',
      derive: function ({ data, category }) {
        check(data)
        // IS: Instrument
        const instrumentCategory = category as InstrumentCategory
        const instrumentData = data as InstrumentFileFormat
        return `${instrumentCategory.abbreviation}_${referencify(
          instrumentData.name
        )}`
      },
      overwriteByDerived: true
    },
    title: {
      title: 'Titel des Instruments',
      derive: function ({ data }) {
        check(data)
        const instrumentData = data as InstrumentFileFormat
        return `Foto des Instruments „${instrumentData.name}“`
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
