import type { TitlesTypes } from '@bldr/type-definitions';
import { DeepTitle } from './deep-title';
export declare class TreeFactory {
    rootList: TitlesTypes.TreeTitleList;
    constructor();
    addTitleByPath(filePath: string): DeepTitle;
    getTree(): TitlesTypes.TreeTitleList;
}
