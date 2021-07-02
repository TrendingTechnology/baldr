import type { MediaCategoriesTypes } from '@bldr/type-definitions'

import { validateMediaId } from '../main'

/**
 * The meta data type specification “radio”.
 */
export const radio: MediaCategoriesTypes.Category = {
  title: 'Schulfunk',
  detectCategoryByPath: new RegExp('^.*/SF/.*(m4a|mp3)$'),
  abbreviation: 'SF',
  props: {
    author: {
      title: 'Autor*in'
    },
    cover: {
      title: 'Vorschau-Bild',
      validate: validateMediaId
    },
    year: {
      title: 'Erscheinungsjahr'
    },
    transcription: {
      title: 'Transkription'
    },
    composer: {
      title: 'Komponist',
      state: 'absent'
    },
    artist: {
      title: 'Künstler',
      state: 'absent'
    }
  }
}
