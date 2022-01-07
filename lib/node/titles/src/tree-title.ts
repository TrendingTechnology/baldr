import { FolderTitle } from './folder-title'
import { DeepTitle } from './deep-title'

import type { TitlesTypes } from '@bldr/type-definitions'

export class TreeTitle implements TitlesTypes.TreeTitle {
  sub: TitlesTypes.TreeTitleList
  folder: FolderTitle
  constructor (deepTitle: DeepTitle, folderName: string) {
    this.sub = {}
    const folderTitle = deepTitle.getFolderTitleByFolderName(folderName)
    if (folderTitle == null) {
      throw new Error('no folder title')
    }
    this.folder = folderTitle
  }
}
