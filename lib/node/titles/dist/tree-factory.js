import { DeepTitle } from './deep-title';
import { TreeTitle } from './tree-title';
export class TreeFactory {
    constructor() {
        this.rootList = {};
    }
    addTitleByPath(filePath) {
        const deepTitle = new DeepTitle(filePath);
        let folderName;
        let list = this.rootList;
        do {
            folderName = deepTitle.shiftFolderName();
            if (folderName != null) {
                if (list[folderName] == null) {
                    list[folderName] = new TreeTitle(deepTitle, folderName);
                }
                list = list[folderName].sub;
            }
        } while (folderName != null);
        return deepTitle;
    }
    getTree() {
        return this.rootList;
    }
}
