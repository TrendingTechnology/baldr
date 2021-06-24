"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleTree = void 0;
/**
 * A tree of folder titles.
 *
 * ```json
 * {
 *   "10": {
 *     "subTree": {
 *       "10_Kontext": {
 *         "subTree": {
 *           "20_Oper-Carmen": {
 *             "subTree": {
 *               "30_Habanera": {
 *                 "subTree": {},
 *                 "title": {
 *                   "title": "Personencharakterisierung in der Oper",
 *                   "folderName": "30_Habanera",
 *                   "path": "10/10_Kontext/20_Musiktheater/20_Oper-Carmen/30_Habanera",
 *                   "hasPraesentation": true,
 *                   "level": 4,
 *                   "subtitle": "<em class=\"person\">Georges Bizet</em>:..."
 *                 }
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 */
class TitleTree {
    constructor(deepTitle, folderName) {
        this.subTree = {};
        if (folderName != null) {
            this.title = deepTitle.getFolderTitleByFolderName(folderName);
        }
    }
    /**
     * Add one deep folder title to the tree.
     *
     * @param deepTitle The deep folder title to add.
     */
    add(deepTitle) {
        console.dir(deepTitle, { depth: null });
        const folderName = deepTitle.shiftFolderName();
        if (folderName == null) {
            return;
        }
        if (this.subTree[folderName] == null) {
            this.subTree[folderName] = new TitleTree(deepTitle, folderName);
        }
        else {
            this.subTree[folderName].add(deepTitle);
        }
    }
    /**
     * Get the tree.
     */
    get() {
        return this.subTree;
    }
}
exports.TitleTree = TitleTree;
