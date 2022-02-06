import { MediaCategoriesTypes } from '@bldr/type-definitions'

import { validateUuid } from '../main'
import { getAudioMetadataValue } from '../audio-metadata'

/**
 * The meta data type specification “composition”.
 */
export const composition: MediaCategoriesTypes.Category = {
  title: 'Komposition',
  detectCategoryByPath: new RegExp('^.*/HB/.*(m4a|mp3)$'),
  props: {
    title: {
      title: 'Titel der Komponistion',
      // 'Tonart CD 4: Spur 29'
      removeByRegexp: /^.*CD.*Spur.*$/i,
      derive: async function ({ filePath }) {
        return getAudioMetadataValue('title', filePath)
      }
    },
    isClassical: {
      title: 'klassische Komposition',
      description: 'Handelt es sich um eine klassische Komposition, dann wird der Komponist hervorgehoben.'
    },
    composer: {
      title: 'Komponsition',
      // Helbling-Verlag
      removeByRegexp: /^.*Verlag.*$/i,
      wikidata: {
        // Komponist
        fromClaim: 'P86',
        secondQuery: 'queryLabels',
        format: 'formatList'
      },
      derive: async function ({ filePath }) {
        return getAudioMetadataValue('composer', filePath)
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
    arranger: {
      title: 'ArrangeurIn',
      wikidata: {
        // Bearbeiter | Arrangeur | Person, die für die Bearbeitung des ursprünglichen Werks zuständig ist
        fromClaim: 'P5202',
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
      },
      format (value: string): string {
        return value.replace(/\0/g, '')
      },
      derive: async function ({ filePath }) {
        return getAudioMetadataValue('musicbrainz_work_id', filePath)
      }
    },
    lyrics: {
      title: 'Liedtext',
      description:
        'Der Liedtext sollte als YAML-Block-Stil „|“ gespeichert werden. Die einzelnen Zeilen sollen mit br-Tags getrennt werden.'
    }
  }
}
