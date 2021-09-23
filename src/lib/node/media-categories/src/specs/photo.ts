import { MediaCategoriesTypes } from '@bldr/type-definitions'

/**
 * The meta data type specification “photo”.
 */
export const photo: MediaCategoriesTypes.Category = {
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
