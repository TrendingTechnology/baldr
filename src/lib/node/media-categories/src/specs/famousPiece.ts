import type { MediaCategory } from '@bldr/type-definitions'

import path from 'path'

/**
 * The meta data type specification “famousePiece”.
 */
export const famousPiece: MediaCategory.Category = {
  title: 'Bekanntes Stück',
  detectCategoryByPath: new RegExp('^.*/Personen/\\w/.*(m4a|mp3)$'),
  props: {
    famousPieceFrom: {
      title: 'Bekanntest Stück von',
      description: 'Der/die Interpret/in Komponist/in eines bekannten Musikstücks.',
      derive: function ({ filePath }) {
        if (filePath != null) {
          return path.dirname(filePath)
        }
      },
      overwriteByDerived: true
    }
  }
}
