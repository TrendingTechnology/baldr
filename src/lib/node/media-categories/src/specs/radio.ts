import type { MediaCategory } from '@bldr/type-definitions'

/**
 * The meta data type specification “radio”.
 */
export const radio: MediaCategory.Category = {
  title: 'Schulfunk',
  abbreviation: 'SF',
  props: {
    author: {
      title: 'Autor*in'
    }
  }
}
