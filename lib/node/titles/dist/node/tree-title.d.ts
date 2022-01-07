import { FolderTitle } from './folder-title';
import { DeepTitle } from './deep-title';
import type { TitlesTypes } from '@bldr/type-definitions';
export declare class TreeTitle implements TitlesTypes.TreeTitle {
    sub: TitlesTypes.TreeTitleList;
    folder: FolderTitle;
    constructor(deepTitle: DeepTitle, folderName: string);
}
