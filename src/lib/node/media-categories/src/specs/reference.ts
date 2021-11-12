import path from 'path'

import { getPdfPageCount } from '@bldr/core-node'
import { MediaCategoriesTypes } from '@bldr/type-definitions'
import { readYamlFile } from '@bldr/file-reader-writer'
import { getBasename } from '@bldr/core-node'
import { getConfig } from '@bldr/config-ng'

const config = getConfig()

interface IndexedReferenceCollection {
  [ref: string]: MediaCategoriesTypes.CategoryReferenceYamlFormat
}

function readReferencesYaml (): IndexedReferenceCollection {
  const rawReferences = readYamlFile(
    path.join(config.mediaServer.basePath, 'Quellen.yml')
  ) as any
  const result = {} as IndexedReferenceCollection
  for (const r of rawReferences) {
    const reference = r as MediaCategoriesTypes.CategoryReferenceYamlFormat
    result[reference.ref] = reference
  }
  return result
}

const references = readReferencesYaml()

function getPropertyFromReference (
  filePath: string | undefined,
  prop: string
): any {
  if (filePath != null) {
    const ref = getBasename(filePath)
    if (references[ref] == null) {
      console.error(`References not found for ${ref} of ${filePath}`)
      return
    }
    const reference = references[ref]
    if (reference[prop] != null) {
      return reference[prop]
    }
  }
}

/**
 * The meta data type specification “reference”.
 */
export const reference: MediaCategoriesTypes.Category = {
  title: 'Quelle',
  description:
    'Quelle, auf der eine Unterrichtsstunde aufbaut, z. B. Auszüge aus Schulbüchern.',
  detectCategoryByPath: function () {
    return new RegExp('^.*/QL/.*.pdf$')
  },
  abbreviation: 'QL',
  props: {
    title: {
      title: 'Titel der Quelle',
      derive: function ({ data, folderTitles }) {
        if (folderTitles == null) {
          return 'Quelle'
        }
        let suffix = ''
        if (data.forTeacher != null) {
          suffix = ' (Lehrerband)'
        }
        return `Quelle zum Thema „${folderTitles.titleAndSubtitle}“${suffix}`
      },
      overwriteByDerived: true
    },
    referenceTitle: {
      title: 'Title der (übergeordneten Quelle)',
      derive: function ({ filePath }) {
        return getPropertyFromReference(filePath, 'referenceTitle')
      }
    },
    referenceSubtitle: {
      title: 'Untertitel der (übergeordneten Quelle)',
      derive: function ({ filePath }) {
        return getPropertyFromReference(filePath, 'referenceSubtitle')
      }
    },
    author: {
      title: 'Autor',
      derive: function ({ filePath }) {
        return getPropertyFromReference(filePath, 'author')
      }
    },
    publisher: {
      title: 'Verlag',
      description:
        'Der Verlagsname ohne „Verlage“ im Titel, z. B. Klett, Diesterweg',
      derive: function ({ filePath }) {
        return getPropertyFromReference(filePath, 'publisher')
      },
      overwriteByDerived: true
    },
    releaseDate: {
      title: 'Erscheinungsdatum',
      derive: function ({ filePath }) {
        return getPropertyFromReference(filePath, 'releaseDate')
      }
    },
    edition: {
      title: 'Auflage',
      description: 'z. B. 1. Auflage des Buchs',
      derive: function ({ filePath }) {
        return getPropertyFromReference(filePath, 'edition')
      }
    },
    pageNos: {
      title: 'Seitenzahlen',
      description:
        'Auf welchen Seiten aus der Quelle dieser Auszug zu finden war. Nicht zu verwechseln mit der Seitenanzahl des PDFs.'
    },
    forTeacher: {
      title: 'Lehrerband',
      derive: function ({ filePath }) {
        return getPropertyFromReference(filePath, 'forTeacher')
      }
    },
    isbn: {
      title: 'ISBN-Nummer (13 Stellen)',
      derive: function ({ filePath }) {
        return getPropertyFromReference(filePath, 'isbn')
      }
    },
    pageCount: {
      title: 'Seitenanzahl des PDFs',
      description: 'Die Seitenanzahl dieses PDFs',
      derive ({ filePath }) {
        if (filePath == null) return
        return getPdfPageCount(filePath)
      },
      overwriteByDerived: true
    },
    ocr: {
      title: 'Texterkennung (OCR)',
      description: 'Ergebnis der Texterkennung'
    }
  }
}
