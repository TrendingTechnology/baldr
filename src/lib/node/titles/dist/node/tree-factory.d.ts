import { DeepTitle } from './deep-title';
import { TreeTitleList } from './tree-title';
export declare class TreeFactory {
    rootList: TreeTitleList;
    constructor();
    addTitleByPath(filePath: string): DeepTitle;
    getTree(): TreeTitleList;
}
