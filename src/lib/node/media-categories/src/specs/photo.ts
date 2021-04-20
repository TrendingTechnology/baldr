import type { MediaCategory } from '@bldr/type-definitions'

/**
 * The meta data type specification “photo”.
 */
export const photo: MediaCategory.Category = {
  title: 'Foto',
  abbreviation: 'FT',
  detectCategoryByPath: function () {
    return new RegExp('^.*/FT/.*.jpg$')
  },
  props: {
    photographer: {
      title: 'Fotograph*in'
    }
  }
}
