import { DeepTitle } from './deep-title'
import { TreeTitle, TreeTitleList } from './tree-title'

export class TreeFactory {
  rootList: TreeTitleList

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

  getTree (): TreeTitleList {
    return this.rootList
  }
}
