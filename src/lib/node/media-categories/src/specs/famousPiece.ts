import type { MediaCategory } from '@bldr/type-definitions'
import { readYamlFile } from '@bldr/file-reader-writer'

import path from 'path'

/**
 * The meta data type specification “famousePiece”.
 */
export const famousPiece: MediaCategory.Category = {
  title: 'Bekanntes Stück',
  detectCategoryByPath: new RegExp('^.*/Personen/\\w/.*(m4a|mp3)$'),
  props: {
    famousPieceFrom: {
      title: 'Bekanntes Stück von',
      description: 'Der/die Interpret/in Komponist/in eines bekannten Musikstücks.',
      derive: function ({ filePath }) {
        if (filePath != null) {
          const match = filePath.match(/^.*\/Personen\/\w/)
          if (match != null) {
            const prefix = match[0]
            const personYaml = readYamlFile(path.join(prefix, 'main.jpg.yml'))
            return personYaml.personId
          }
        }
      },
      overwriteByDerived: true
    }
  }
}
