"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeFactory = void 0;
const deep_title_1 = require("./deep-title");
const tree_title_1 = require("./tree-title");
class TreeFactory {
    constructor() {
        this.rootList = {};
    }
    addTitleByPath(filePath) {
        const deepTitle = new deep_title_1.DeepTitle(filePath);
        let folderName;
        let list = this.rootList;
        do {
            folderName = deepTitle.shiftFolderName();
            if (folderName != null) {
                if (list[folderName] == null) {
                    list[folderName] = new tree_title_1.TreeTitle(deepTitle, folderName);
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
exports.TreeFactory = TreeFactory;
