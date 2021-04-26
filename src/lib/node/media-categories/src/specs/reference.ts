import type { MediaCategory } from '@bldr/type-definitions'

import { getPdfPageCount } from '@bldr/core-node'

/**
 * The meta data type specification “reference”.
 */
export const reference: MediaCategory.Category = {
  title: 'Quelle',
  description: 'Quelle, auf der eine Unterrichtsstunde aufbaut, z. B. Auszüge aus Schulbüchern.',
  detectCategoryByPath: function () {
    return new RegExp('^.*/QL/.*.pdf$')
  },
  abbreviation: 'QL',
  props: {
    title: {
      title: 'Titel der Quelle',
      derive: function ({ data, folderTitles }) {
        if (folderTitles == null) return 'Quelle'
        let suffix = ''
        if (data.forTeacher != null) {
          suffix = ' (Lehrerband)'
        }
        return `Quelle zum Thema „${folderTitles.titleAndSubtitle}“${suffix}`
      },
      overwriteByDerived: true
    },
    referenceTitle: {
      title: 'Title der (übergeordneten Quelle)'
    },
    referenceSubtitle: {
      title: 'Untertitel der (übergeordneten Quelle)'
    },
    author: {
      title: 'Autor'
    },
    publisher: {
      title: 'Verlag'
    },
    releaseDate: {
      title: 'Erscheinungsdatum'
    },
    edition: {
      title: 'Auflage',
      description: 'z. B. 1. Auflage des Buchs'
    },
    pageNos: {
      title: 'Seitenzahlen',
      description: 'Auf welchen Seiten aus der Quelle dieser Auszug zu finden war. Nicht zu verwechseln mit der Seitenanzahl des PDFs.'
    },
    forTeacher: {
      title: 'Lehrerband'
    },
    isbn: {
      title: 'ISBN-Nummer (13 Stellen)'
    },
    pageCount: {
      title: 'Seitenanzahl des PDFs',
      description: 'Die Seitenanzahl dieses PDFs',
      derive ({ filePath }) {
        if (filePath == null) return
        return getPdfPageCount(filePath)
      },
      overwriteByDerived: true
    }
  }
}
