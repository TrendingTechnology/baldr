import { TreeTitleList } from './tree-title';
export declare class TreeFactory {
    rootList: TreeTitleList;
    constructor();
    addTitleByPath(filePath: string): void;
    getTree(): TreeTitleList;
}
