"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeTitle = void 0;
class TreeTitle {
    constructor(deepTitle, folderName) {
        this.sub = {};
        const folderTitle = deepTitle.getFolderTitleByFolderName(folderName);
        if (folderTitle == null) {
            throw new Error('no folder title');
        }
        this.folder = folderTitle;
    }
}
exports.TreeTitle = TreeTitle;
