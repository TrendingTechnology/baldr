import type { TitlesTypes } from '@bldr/type-definitions'

import { DeepTitle } from './deep-title'
import { TreeTitle } from './tree-title'

export class TreeFactory {
  rootList: TitlesTypes.TreeTitleList

  constructor () {
    this.rootList = {}
  }

  addTitleByPath (filePath: string): DeepTitle {
    const deepTitle = new DeepTitle(filePath)
    let folderName: string | undefined

    let list = this.rootList

    do {
      folderName = deepTitle.shiftFolderName()
      if (folderName != null) {
        if (list[folderName] == null) {
          list[folderName] = new TreeTitle(deepTitle, folderName)
        }
        list = list[folderName].sub
      }
    } while (folderName != null)
    return deepTitle
  }

  getTree (): TitlesTypes.TreeTitleList {
    return this.rootList
  }
}
