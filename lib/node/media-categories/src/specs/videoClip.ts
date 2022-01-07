import { MediaCategoriesTypes } from '@bldr/type-definitions'

/**
 * The meta data type specification “videoClip”.
 */
export const videoClip: MediaCategoriesTypes.Category = {
  title: 'Videoclip',
  props: {
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
    }
  }
}
