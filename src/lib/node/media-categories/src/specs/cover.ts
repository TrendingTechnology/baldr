import { MediaCategoriesTypes } from '@bldr/type-definitions'

/**
 * The meta data type specification “cover”.
 */
export const cover: MediaCategoriesTypes.Category = {
  title: 'Vorschau-Bild',
  detectCategoryByPath: new RegExp('^.*/HB/.*(png|jpg)$'),
  props: {
    title: {
      title: 'Titel',
      format: function (value) {
        return value.replace(/^(Cover-Bild: )?/, 'Cover-Bild: ')
      }
    },
    source: {
      title: 'Quelle (HTTP-URL)',
      validate (value) {
        return value.match(/^https?.*$/)
      }
    }
  }
}
