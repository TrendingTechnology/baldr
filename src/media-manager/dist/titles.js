"use strict";
/**
 * @module @bldr/media-server/titles
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * The configuration object from `/etc/baldr.json`
 */
const config_1 = __importDefault(require("@bldr/config"));
/**
 * Hold some meta data about a folder and its title.
 */
class FolderTitle {
    /**
     * @param {Object} data - Some meta data about the folder.
     * @property {String} title - The title. It is the first line in the file
     *   `titles.txt`.
     * @property {String} subtitle - The subtitle. It is the second line in the
     *   file `titles.txt`.
     * @property {String} folderName - The name of the parent folder, for
     *   example `10_Konzertierende-Musiker`
     * @property {String} path - The relative path of the folder inside the
     *   base path, for example `12/10_Interpreten/10_Konzertierende-Musiker`.
     * @property {Boolean} hasPraesentation - True if the folder contains a file
     *   with the file name `Praesentation.baldr.yml`
     */
    constructor({ title, subtitle, folderName, path, hasPraesentation }) {
        this.title = title;
        this.subtitle = subtitle;
        this.folderName = folderName;
        this.path = path;
        this.hasPraesentation = hasPraesentation;
    }
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
class HierarchicalFolderTitle {
    /**
     * @param filePath - The path of a file in a folder with `title.txt`
     *   files.
     */
    constructor(filePath) {
        this.titles = [];
        this.read(filePath);
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
        if (titles.length > 1 && titles[1]) {
            folderTitle.subtitle = titles[1];
        }
        if (fs_1.default.existsSync(path_1.default.join(path_1.default.dirname(filePath), 'Praesentation.baldr.yml'))) {
            folderTitle.hasPraesentation = true;
        }
        return folderTitle;
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
        // 10, 11
        const depth = segments.length;
        // 5
        const minDepth = config_1.default.mediaServer.basePath.split(path_1.default.sep).length;
        // To build the path property of the FolderTitle class.
        const folderNames = [];
        for (let index = minDepth + 1; index < depth; index++) {
            const folderName = segments[index - 1];
            folderNames.push(folderName);
            // [ '', 'var', 'data', 'baldr', 'media', '05' ]
            const pathSegments = segments.slice(0, index);
            // /var/data/baldr/media/05/title.txt
            // /var/data/baldr/media/05/20_Mensch-Zeit/title.txt
            // /var/data/baldr/media/05/20_Mensch-Zeit/10_Mozart/title.txt
            // /var/data/baldr/media/05/20_Mensch-Zeit/10_Mozart/20_Biographie-Salzburg-Wien/title.txt
            const titleTxt = [...pathSegments, 'title.txt'].join(path_1.default.sep);
            if (fs_1.default.existsSync(titleTxt)) {
                const folderTitle = this.readTitleTxt(titleTxt);
                folderTitle.path = folderNames.join(path_1.default.sep);
                folderTitle.folderName = folderName;
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
        if (this.lastFolderTitleObject.subtitle) {
            return this.lastFolderTitleObject.subtitle;
        }
    }
    /**
     * Combine the title and the subtitle (`Title - Subtitle`).
     */
    get titleAndSubtitle() {
        if (this.subtitle)
            return `${this.title} - ${this.subtitle}`;
        return this.title;
    }
    /**
     * The first folder level in the hierachical folder structure must be named
     * with numbers.
     */
    get grade() {
        return this.titles[0].title.replace(/[^\d]+$/, '');
    }
    /**
     * List all `FolderTitle()` objects.
     *
     * @returns {Array}
     */
    list() {
        return this.titles;
    }
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
class FolderTitleTree {
    constructor() {
        this.tree = {};
    }
    /**
     * Add one folder title to the tree.
     *
     * @param folderTitle
     */
    add(folderTitle) {
        let count = 1;
        for (const title of folderTitle.list()) {
            if (!(title.folderName in this.tree)) {
                this.tree[title.folderName] = {
                    _title: title
                };
                this.tree[title.folderName]._title.level = count;
            }
            this.tree = this.tree[title.folderName];
            count += 1;
        }
    }
    /**
     * Get the tree.
     */
    get() {
        return this.tree;
    }
}
module.exports = {
    HierarchicalFolderTitles: HierarchicalFolderTitle,
    FolderTitleTree
};
