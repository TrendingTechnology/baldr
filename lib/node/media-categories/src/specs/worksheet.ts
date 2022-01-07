import { MediaCategoriesTypes } from '@bldr/type-definitions'

import path from 'path'

import { getPdfPageCount } from '@bldr/core-node'

/**
 * The meta data type specification “worksheet”.
 */
export const worksheet: MediaCategoriesTypes.Category = {
  title: 'Arbeitsblatt',
  abbreviation: 'TX',
  detectCategoryByPath: function () {
    return new RegExp('^.*/TX/.*.pdf$')
  },
  props: {
    title: {
      title: 'Titel',
      derive: function ({ folderTitles, filePath }) {
        if (folderTitles == null || filePath == null) {
          return 'Arbeitsblatt'
        }
        const match = filePath.match(
          new RegExp(`${path.sep}([^${path.sep}]+)\\.pdf`)
        )
        let baseName: string = 'Arbeitsblatt'
        if (match != null) {
          baseName = match[1]
        }
        return `${baseName} zum Thema „${folderTitles.titleAndSubtitle}“`
      },
      overwriteByDerived: true
    },
    pageCount: {
      title: 'Seitenanzahl des PDFs',
      description: 'Die Seitenanzahl dieses PDFs',
      derive ({ filePath }) {
        if (filePath != null) {
          return getPdfPageCount(filePath)
        }
      },
      overwriteByDerived: true
    }
  }
}
