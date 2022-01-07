import { MediaCategoriesTypes } from '@bldr/type-definitions'

/**
 * The meta data type specification “song”.
 */
export const song: MediaCategoriesTypes.Category = {
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
