import type { TitlesTypes } from '@bldr/type-definitions';
export declare class FolderTitle implements TitlesTypes.FolderTitle {
    title: string;
    subtitle?: string;
    folderName: string;
    relPath: string;
    hasPresentation: boolean;
    level?: number;
    /**
     * @param data - Some meta data about the folder.
     */
    constructor({ title, subtitle, folderName, relPath, hasPresentation, level }: TitlesTypes.FolderTitleSpec);
}
