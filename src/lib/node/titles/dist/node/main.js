"use strict";
/**
 * Read the nexted titles.txt files and form a hierarchical data structure.
 *
 * @module @bldr/titles
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleTree = exports.DeepTitle = void 0;
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Hold some meta data about a folder and its title.
 */
class FolderTitle {
    /**
     * @param data - Some meta data about the folder.
     */
    constructor({ title, subtitle, folderName, path, hasPraesentation, level }) {
        this.title = title;
        if (subtitle != null)
            this.subtitle = subtitle;
        this.folderName = folderName;
        this.path = path;
        this.hasPraesentation = (hasPraesentation != null && hasPraesentation);
        this.level = level;
    }
}
/**
 * Hold metadata about a folder and its titles in a hierarchical folder
 * structure.
 */
class DeepTitle {
    /**
     * @param filePath - The path of a file in a folder with `title.txt`
     *   files.
     */
    constructor(filePath) {
        this.titles = [];
        this.read(filePath);
        this.folderNames = this.titles.map(folderTitle => folderTitle.folderName);
    }
    /**
     * Get the first folder name and remove it from the array.
     */
    shiftFolderName() {
        return this.folderNames.shift();
    }
    /**
     * Parse the `title.txt` text file. The first line of this file contains
     * the title, the second lines contains the subtitle.
     *
     * @param filePath - The absolute path of a `title.txt` file.
     */
    readTitleTxt(filePath) {
        const titleRaw = fs_1.default.readFileSync(filePath, { encoding: 'utf-8' });
        const titles = titleRaw.split('\n');
        const folderTitle = new FolderTitle({});
        if (titles.length > 0) {
            folderTitle.title = titles[0];
        }
        if (titles.length > 1 && titles[1] != null) {
            folderTitle.subtitle = titles[1];
        }
        if (fs_1.default.existsSync(path_1.default.join(path_1.default.dirname(filePath), 'Praesentation.baldr.yml'))) {
            folderTitle.hasPraesentation = true;
        }
        return folderTitle;
    }
    /**
     * Generate the path of the title.txt file `/var/data/baldr/media/05/title.txt`
     *
     * @param pathSegments An array of path segments `['', 'var', 'data', 'baldr',
     *   'media', '05']` without the filename `title.txt` itself.
     *
     * @returns The path of a title.txt file
     */
    generateTitleTxtPath(pathSegments) {
        return [...pathSegments, 'title.txt'].join(path_1.default.sep);
    }
    /**
     * Find the deepest title.txt or the title.txt file with the shortest path of
     * a given path.
     *
     * @param filePath A file path from which to descend into the folder
     *   structure.
     *
     * @returns The deepest title.txt or the title.txt file with the shortest
     *   path. `/var/data/baldr/media/05/title.txt`
     */
    findDeepestTitleTxt(filePath) {
        const parentDir = path_1.default.dirname(filePath);
        const segments = parentDir.split(path_1.default.sep);
        let deepestTitleTxt = '';
        for (let index = segments.length; index > 0; index--) {
            const pathSegments = segments.slice(0, index);
            // /var/data/baldr/media/05/20_Mensch-Zeit/10_Mozart/20_Biographie-Salzburg-Wien/title.txt
            // /var/data/baldr/media/05/20_Mensch-Zeit/10_Mozart/title.txt
            // /var/data/baldr/media/05/20_Mensch-Zeit/title.txt
            // /var/data/baldr/media/05/title.txt
            // -> BREAK
            const titleTxt = this.generateTitleTxtPath(pathSegments);
            if (!fs_1.default.existsSync(titleTxt)) {
                break;
            }
            else {
                deepestTitleTxt = titleTxt;
            }
        }
        return deepestTitleTxt;
    }
    /**
     * Read all `title.txt` files. Descend to all parent folders which contain
     * a `title.txt` file.
     *
     * @param filePath - The path of the presentation file.
     */
    read(filePath) {
        // We need absolute paths. The cli gives us relative paths.
        filePath = path_1.default.resolve(filePath);
        // ['', 'var', 'data', 'baldr', 'media', '12', ..., 'Praesentation.baldr.yml']
        const segments = filePath.split(path_1.default.sep);
        const depth = segments.length;
        const deepestTitleTxt = this.findDeepestTitleTxt(filePath);
        const minDepth = deepestTitleTxt.split(path_1.default.sep).length;
        // To build the path property of the FolderTitle class.
        const folderNames = [];
        let level = 1;
        for (let index = minDepth - 1; index < depth; index++) {
            const folderName = segments[index - 1];
            folderNames.push(folderName);
            // [ '', 'var', 'data', 'baldr', 'media', '05' ]
            const pathSegments = segments.slice(0, index);
            // /var/data/baldr/media/05/title.txt
            // /var/data/baldr/media/05/20_Mensch-Zeit/title.txt
            // /var/data/baldr/media/05/20_Mensch-Zeit/10_Mozart/title.txt
            // /var/data/baldr/media/05/20_Mensch-Zeit/10_Mozart/20_Biographie-Salzburg-Wien/title.txt
            const titleTxt = this.generateTitleTxtPath(pathSegments);
            if (fs_1.default.existsSync(titleTxt)) {
                const folderTitle = this.readTitleTxt(titleTxt);
                folderTitle.path = folderNames.join(path_1.default.sep);
                folderTitle.folderName = folderName;
                folderTitle.level = level++;
                this.titles.push(folderTitle);
            }
        }
    }
    /**
     * Get an array of title strings.
     */
    get titlesArray() {
        return this.titles.map(folderTitle => folderTitle.title);
    }
    /**
     * Get the last instance of the class FolderTitle
     */
    get lastFolderTitleObject() {
        return this.titles[this.titles.length - 1];
    }
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
    get allTitles() {
        return this.titlesArray.join(' / ');
    }
    /**
     * Not the first and last title as a array.
     */
    get curriculumTitlesArray() {
        return this.titlesArray.slice(1, this.titles.length - 1);
    }
    /**
     * Not the title of the first and the last folder.
     *
     * -> Lernbereich 2: Musik - Mensch - Zeit / Johann Sebastian Bach: Musik als Bekenntnis
     */
    get curriculum() {
        return this.curriculumTitlesArray.join(' / ');
    }
    /**
     * The parent directory name with the numeric prefix: For example
     * `Bachs-vergebliche-Reise`.
     */
    get id() {
        return this.lastFolderTitleObject.folderName.replace(/\d\d_/, '');
    }
    /**
     * The title. It is the first line in the text file `title.txt` in the
     * same folder as the constructor `filePath` file.
     */
    get title() {
        return this.lastFolderTitleObject.title;
    }
    /**
     * The subtitle. It is the second line in the text file `title.txt` in the
     * same folder as the constructor `filePath` file.
     */
    get subtitle() {
        if (this.lastFolderTitleObject.subtitle != null) {
            return this.lastFolderTitleObject.subtitle;
        }
    }
    /**
     * Combine the title and the subtitle (`Title - Subtitle`).
     */
    get titleAndSubtitle() {
        if (this.subtitle != null)
            return `${this.title} - ${this.subtitle}`;
        return this.title;
    }
    /**
     * The first folder level in the hierachical folder structure must be named
     * with numbers.
     */
    get grade() {
        return parseInt(this.titles[0].title.replace(/[^\d]+$/, ''));
    }
    /**
     * List all `FolderTitle()` objects.
     */
    list() {
        return this.titles;
    }
    /**
     * Get the folder title object by the name of the current folder.
     *
     * @param folderName - A folder name. The name must in the titles
     *   array to get an result.
     */
    getFolderTitleByFolderName(folderName) {
        for (const folderTitle of this.titles) {
            if (folderTitle.folderName === folderName) {
                return folderTitle;
            }
        }
    }
    /**
     * Generate a object containing the meta informations of a presentation.
     */
    generatePresetationMeta() {
        const result = {
            id: this.id,
            subtitle: this.subtitle,
            title: this.title,
            grade: this.grade,
            curriculum: this.curriculum
        };
        if (result.subtitle == null || result.subtitle === '')
            delete result.subtitle;
        return result;
    }
}
exports.DeepTitle = DeepTitle;
/**
 * A tree of folder titles.
 *
 * ```json
 * {
 *   "10": {
 *     "subTree": {
 *       "10_Kontext": {
 *         "subTree": {
 *           "20_Oper-Carmen": {
 *             "subTree": {
 *               "30_Habanera": {
 *                 "subTree": {},
 *                 "title": {
 *                   "title": "Personencharakterisierung in der Oper",
 *                   "folderName": "30_Habanera",
 *                   "path": "10/10_Kontext/20_Musiktheater/20_Oper-Carmen/30_Habanera",
 *                   "hasPraesentation": true,
 *                   "level": 4,
 *                   "subtitle": "<em class=\"person\">Georges Bizet</em>:..."
 *                 }
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 */
class TitleTree {
    constructor(deepTitle, folderName) {
        this.subTree = {};
        if (folderName != null) {
            this.title = deepTitle.getFolderTitleByFolderName(folderName);
        }
    }
    /**
     * Add one deep folder title to the tree.
     *
     * @param deepTitle The deep folder title to add.
     */
    add(deepTitle) {
        const folderName = deepTitle.shiftFolderName();
        if (folderName == null)
            return;
        if (this.subTree[folderName] == null) {
            this.subTree[folderName] = new TitleTree(deepTitle, folderName);
        }
        else {
            this.subTree[folderName].add(deepTitle);
        }
    }
    /**
     * Get the tree.
     */
    get() {
        return this.subTree;
    }
}
exports.TitleTree = TitleTree;
