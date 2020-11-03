/**
 * Hold metadata about a folder and its titles in a hierarchical folder
 * structure.
 *
 * ```js
 * HierarchicalFolderTitles {
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
export class HierarchicalFolderTitles {
    /**
     * @param {String} filePath - The path of a file in a folder with `title.txt`
     *   files.
     */
    constructor(filePath: string);
    titles_: any[];
    /**
     * Parse the `title.txt` text file. The first line of this file contains
     * the title, the second lines contains the subtitle.
     *
     * @param {String} filePath - The absolute path of a `title.txt` file.
     *
     * @private
     */
    private readTitleTxt_;
    /**
     * Read all `title.txt` files. Descend to all parent folders which contain
     * a `title.txt` file.
     *
     * @param {String} filePath - The path of the presentation file.
     *
     * @private
     */
    private read_;
    /**
     * An array of title strings.
     *
     * @type {array}
     * @private
     */
    private get titlesArray_();
    /**
     * @private
     */
    private get lastFolderTitleObject_();
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
     *
     * @returns {string}
     */
    get allTitles(): string;
    /**
     * Not the first and last title as a array.
     *
     * @type {Array}
     */
    get curriculumTitlesArray(): any[];
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
     *
     */
    get curriculum(): string;
    /**
     * The parent directory name with the numeric prefix: For example
     * `Bachs-vergebliche-Reise`.
     *
     * @returns {String}
     */
    get id(): string;
    /**
     * The title. It is the first line in the text file `title.txt` in the
     * same folder as the constructor `filePath` file.
     *
     * @returns {String}
     */
    get title(): string;
    /**
     * The subtitle. It is the second line in the text file `title.txt` in the
     * same folder as the constructor `filePath` file.
     *
     * @returns {String}
     */
    get subtitle(): string;
    /**
     * Combine the title and the subtitle (`Title - Subtitle`).
     *
     * @returns {String}
     */
    get titleAndSubtitle(): string;
    /**
     * The first folder level in the hierachical folder structure must be named
     * with numbers.
     *
     * @returns {string}
     */
    get grade(): string;
    /**
     * List all `FolderTitle()` objects.
     *
     * @returns {Array}
     */
    list(): any[];
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
export class FolderTitleTree {
    /**
     * @private
     */
    private tree_;
    /**
     * Add one folder title to the tree.
     *
     * @param {module:@bldr/media-server/titles~HierarchicalFolderTitles} folderTitles
     */
    add(folderTitles: any): void;
    /**
     * Get the tree.
     *
     * @returns {Object}
     */
    get(): any;
}
