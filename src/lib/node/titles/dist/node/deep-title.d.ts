import { LampTypes, TitlesTypes } from '@bldr/type-definitions';
import { FolderTitle } from './folder-title';
export declare class DeepTitle implements TitlesTypes.DeepTitle {
    /**
     * An array of folder titles. The last element is the folder title of
     * the `filePath`.
     */
    private readonly titles;
    /**
     * An array of folder names. This array is used to descent the folder tree.
     */
    private readonly folderNames;
    /**
     * @param filePath - The path of a file in a folder with `title.txt`
     *   files.
     */
    constructor(filePath: string);
    shiftFolderName(): string | undefined;
    /**
     * Parse the `title.txt` text file. The first line of this file contains
     * the title, the second lines contains the subtitle.
     *
     * @param filePath - The absolute path of a `title.txt` file.
     */
    private readTitleTxt;
    /**
     * Generate the path of the title.txt file `/var/data/baldr/media/05/title.txt`
     *
     * @param pathSegments An array of path segments `['', 'var', 'data', 'baldr',
     *   'media', '05']` without the filename `title.txt` itself.
     *
     * @returns The path of a title.txt file
     */
    private generateTitleTxtPath;
    /**
     * Find all title.txt files (from the deepest to the shallowest title.txt)
     *
     * @param filePath A file path from which to descend into the folder
     *   structure.
     *
     * @returns An array with absolute file path. First the deepest title.txt
     *   file. Last the shallowest title.txt file.
     */
    private findTitleTxt;
    /**
     * Read all `title.txt` files. Descend to all parent folders which contain
     * a `title.txt` file.
     *
     * @param filePath - The path of the presentation file.
     */
    private read;
    /**
     * Get an array of title strings.
     */
    private get titlesArray();
    /**
     * Get the last instance of the class FolderTitle
     */
    private get lastFolderTitleObject();
    get allTitles(): string;
    get curriculumTitlesArray(): string[];
    get curriculum(): string;
    get curriculumTitlesArrayFromGrade(): string[];
    get curriculumFromGrade(): string;
    get ref(): string;
    get title(): string;
    get subtitle(): string | undefined;
    get titleAndSubtitle(): string;
    /**
     * Get the index number of the folder title object containing “X. Jahrgangsstufe”.
     */
    private get gradeIndexPosition();
    get grade(): number;
    list(): FolderTitle[];
    getFolderTitleByFolderName(folderName: string): FolderTitle | undefined;
    generatePresetationMeta(): LampTypes.PresentationMeta;
}
