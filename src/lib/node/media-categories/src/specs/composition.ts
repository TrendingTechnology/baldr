import type { MediaCategoriesTypes } from '@bldr/type-definitions'

import { validateUuid } from '../main'

/**
 * The meta data type specification “composition”.
 */
export const composition: MediaCategoriesTypes.Category = {
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
