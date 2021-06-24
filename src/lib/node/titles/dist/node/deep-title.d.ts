import { PresentationTypes } from '@bldr/type-definitions';
import { FolderTitle } from './folder-title';
/**
 * Hold metadata about a folder and its titles in a hierarchical folder
 * structure.
 */
export declare class DeepTitle {
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
    /**
     * Get the first folder name and remove it from the array.
     */
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
    /**
     * All titles concatenated with ` / ` (Include the first and the last title)
     * without the subtitles.
     *
     * for example:
     *
     * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
     * Johann Sebastian Bach: Musik als Bekenntnis /
     * Johann Sebastian Bachs Reise nach Berlin 1747
     */
    get allTitles(): string;
    /**
     * Not the first and last title as a array.
     */
    get curriculumTitlesArray(): string[];
    /**
     * Not the title of the first and the last folder.
     *
     * -> Lernbereich 2: Musik - Mensch - Zeit / Johann Sebastian Bach: Musik als Bekenntnis
     */
    get curriculum(): string;
    /**
     * The parent directory name with the numeric prefix: For example
     * `Bachs-vergebliche-Reise`.
     */
    get ref(): string;
    /**
     * The title. It is the first line in the text file `title.txt` in the
     * same folder as the constructor `filePath` file.
     */
    get title(): string;
    /**
     * The subtitle. It is the second line in the text file `title.txt` in the
     * same folder as the constructor `filePath` file.
     */
    get subtitle(): string | undefined;
    /**
     * Combine the title and the subtitle (`Title - Subtitle`).
     */
    get titleAndSubtitle(): string;
    /**
     * The first folder level in the hierachical folder structure must be named
     * with numbers.
     */
    get grade(): number;
    /**
     * List all `FolderTitle()` objects.
     */
    list(): FolderTitle[];
    /**
     * Get the folder title object by the name of the current folder.
     *
     * @param folderName - A folder name. The name must in the titles
     *   array to get an result.
     */
    getFolderTitleByFolderName(folderName: string): FolderTitle | undefined;
    /**
     * Generate a object containing the meta informations of a presentation.
     */
    generatePresetationMeta(): PresentationTypes.PresentationMeta;
}
