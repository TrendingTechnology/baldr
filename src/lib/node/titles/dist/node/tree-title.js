"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeTitle = void 0;
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
