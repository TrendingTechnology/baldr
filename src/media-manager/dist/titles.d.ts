/**
 * @module @bldr/media-server/titles
 */
interface FolderTitleSpec {
    /**
     * The title. It is the first line in the file `titles.txt`.
     */
    title: string;
    /**
     * The subtitle. It is the second line in the file `titles.txt`.
     */
    subtitle: string;
    /**
     * The name of the parent folder, for example `10_Konzertierende-Musiker`
     */
    folderName: string;
    /**
     * The relative path of the folder inside the base path, for example
     * `12/10_Interpreten/10_Konzertierende-Musiker`.
     */
    path: string;
    /**
     * True if the folder contains a file with the file name
     * `Praesentation.baldr.yml`
     */
    hasPraesentation: boolean;
    /**
     * The level in a folder title tree, starting with 1. 1 ist the top level.
     */
    level: number;
}
/**
 * Hold some meta data about a folder and its title.
 */
declare class FolderTitle {
    /**
     * The title. It is the first line in the file `titles.txt`.
     */
    title: string;
    /**
     * The subtitle. It is the second line in the file `titles.txt`.
     */
    subtitle: string;
    /**
     * The name of the parent folder, for example `10_Konzertierende-Musiker`
     */
    folderName: string;
    /**
     * The relative path of the folder inside the base path, for example
     * `12/10_Interpreten/10_Konzertierende-Musiker`.
     */
    path: string;
    /**
     * True if the folder contains a file with the file name
     * `Praesentation.baldr.yml`
     */
    hasPraesentation: boolean;
    /**
     * The level in a folder title tree, starting with 1. 1 ist the top level.
     */
    level: number;
    /**
     * @param {Object} data - Some meta data about the folder.
     */
    constructor({ title, subtitle, folderName, path, hasPraesentation, level }: FolderTitleSpec);
}
/**
 * Hold metadata about a folder and its titles in a hierarchical folder
 * structure.
 *
 * ```js
 * HierarchicalFolderTitle {
 *   titles_: [
 *     FolderTitle {
 *       path: '06',
 *       title: '6. Jahrgangsstufe',
 *       folderName: '06'
 *     },
 *     FolderTitle {
 *       path: '06/20_Mensch-Zeit',
 *       title: 'Lernbereich 2: Musik - Mensch - Zeit',
 *       folderName: '20_Mensch-Zeit'
 *     },
 *     FolderTitle {
 *       path: '06/20_Mensch-Zeit/10_Bach',
 *       title: 'Johann Sebastian Bach: Musik als Bekenntnis',
 *       folderName: '10_Bach'
 *     },
 *     FolderTitle {
 *       path: '06/20_Mensch-Zeit/10_Bach/40_Bachs-vergebliche-Reise',
 *       title: 'Johann Sebastian Bachs Reise nach Berlin 1747',
 *       folderName: '40_Bachs-vergebliche-Reise'
 *     }
 *   ]
 * }
 * ```
 */
export declare class DeepTitle {
    private titles;
    /**
     * An array of folder names. This array is used to descent the folder tree.
     */
    private folderNames;
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
     * ```js
     * HierarchicalFolderTitles {
     *   titles_: [
     *     FolderTitle {
     *       title: '6. Jahrgangsstufe'
     *     },
     *     FolderTitle {
     *       title: 'Lernbereich 2: Musik - Mensch - Zeit'
     *     },
     *     FolderTitle {
     *       title: 'Johann Sebastian Bach: Musik als Bekenntnis'
     *     },
     *     FolderTitle {
     *       title: 'Johann Sebastian Bachs Reise nach Berlin 1747'
     *     }
     *   ]
     * }
     * ```
     *
     * -> Lernbereich 2: Musik - Mensch - Zeit / Johann Sebastian Bach: Musik als Bekenntnis
     */
    get curriculum(): string;
    /**
     * The parent directory name with the numeric prefix: For example
     * `Bachs-vergebliche-Reise`.
     */
    get id(): string;
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
    get grade(): string;
    /**
     * List all `FolderTitle()` objects.
     *
     * @returns {Array}
     */
    list(): FolderTitle[];
}
interface SubTree {
    [key: string]: FolderTitleTree;
}
/**
 * A tree of folder titles.
 *
 * ```json
 * {
 *   "10": {
 *     "_title": {
 *       "title": "10. Jahrgangsstufe",
 *       "path": "10",
 *       "folderName": "10",
 *       "level": 1
 *     },
 *     "10_Kontext": {
 *       "_title": {
 *         "title": "Musik im Kontext",
 *         "path": "10/10_Kontext",
 *         "folderName": "10_Kontext",
 *         "level": 2
 *       },
 *       "10_Musiktheater-Ueberblick": {
 *         "_title": {
 *           "title": "Musiktheater: Überblick",
 *           "hasPraesentation": true,
 *           "path": "10/10_Kontext/20_Musiktheater/10_Musiktheater-Ueberblick",
 *           "folderName": "10_Musiktheater-Ueberblick",
 *           "level": 3
 *         }
 *       },
 *       "20_Oper-Carmen": {
 *         "_title": {
 *           "title": "<em class=\"person\">Georges Bizet</em>: Oper <em class=\"piece\">„Carmen“</em> (1875)",
 *           "path": "10/10_Kontext/20_Musiktheater/20_Oper-Carmen",
 *           "folderName": "20_Oper-Carmen",
 *           "level": 3
 *         },
 *         "10_Hauptpersonen": {
 *           "_title": {
 *             "title": "Personencharakteristik der vier Hauptpersonen",
 *             "hasPraesentation": true,
 *             "path": "10/10_Kontext/20_Musiktheater/20_Oper-Carmen/10_Hauptpersonen",
 *             "folderName": "10_Hauptpersonen",
 *             "level": 4
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export declare class FolderTitleTree {
    private subTree;
    deepTitle: DeepTitle;
    constructor(folderTitle: DeepTitle);
    /**
     * Add one folder title to the tree.
     *
     * @param folderTitle
     */
    add(folderTitle: DeepTitle): void;
    /**
     * Get the tree.
     */
    get(): SubTree;
}
export {};
