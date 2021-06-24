import { FolderTitle } from './folder-title';
import { DeepTitle } from './deep-title';
/**
 * A list of sub trees.
 */
export interface SubTreeList {
    [folderName: string]: TitleTree;
}
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
export declare class TitleTree {
    private subTree;
    title?: FolderTitle;
    constructor(deepTitle: DeepTitle, folderName?: string);
    /**
     * Add one deep folder title to the tree.
     *
     * @param deepTitle The deep folder title to add.
     */
    add(deepTitle: DeepTitle): void;
    /**
     * Get the tree.
     */
    get(): SubTreeList;
}
