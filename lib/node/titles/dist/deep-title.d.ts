import { PresentationTypes, TitlesTypes } from '@bldr/type-definitions';
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
     * @param filePath - The path of a file in a folder with a `title.txt`
     *   file.
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
     * @returns An array with absolute file paths. First the deepest title.txt
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
    /**
     * For example: `Fach Musik / 5. Jahrgangsstufe / Lernbereich 4: Musik und
     * ihre Grundlagen / Instrumente verschiedener Gruppen / Hör-Labyrinth`
     */
    get allTitles(): string;
    get curriculumTitlesArray(): string[];
    /**
     * For example: `5. Jahrgangsstufe / Lernbereich 4: Musik und ihre Grundlagen
     * / Instrumente verschiedener Gruppen`
     */
    get curriculum(): string;
    get curriculumTitlesArrayFromGrade(): string[];
    /**
     * Lehrplan ab der Jahrgangsstufe, d.h. ohne `Fach Musik / 5. Jahrgangsstufe`
     *
     * `Lernbereich 4: Musik und ihre Grundlagen / Instrumente verschiedener Gruppen`
     */
    get curriculumFromGrade(): string;
    /**
     * The subject without the prefix `Fach `. For example `Musik` or `Informatik`.
     * German: `Unterrichtsfach`.
     */
    get subject(): string;
    /**
     * For example: `Hoer-Labyrinth`. An automatically generated reference string. The reference is identical
     * to the last folder name without the prefix `\d\d_`.
     */
    get ref(): string;
    /**
     * The title of the last folder title object.
     */
    get title(): string;
    /**
     * The subtitle of the last folder title object.
     */
    get subtitle(): string | undefined;
    /**
     * `Title - Subtitle`
     */
    get titleAndSubtitle(): string;
    /**
     * Get the index number of the folder title object containing “X. Jahrgangsstufe”.
     */
    private get gradeIndexPosition();
    /**
     * German `Jahrgangsstufe`.
     */
    get grade(): number;
    /**
     * List all folder titles.
     */
    list(): FolderTitle[];
    getFolderTitleByFolderName(folderName: string): FolderTitle | undefined;
    /**
     * Generate the presentation meta data.
     */
    generatePresetationMeta(): PresentationTypes.PresentationMeta;
}
