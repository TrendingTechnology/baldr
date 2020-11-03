/**
 * @module @bldr/media-server/titles
 */
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Node packages.
var fs = require('fs');
var path = require('path');
/**
 * The configuration object from `/etc/baldr.json`
 */
var config = require('@bldr/config');
/**
 * Hold some meta data about a folder and its title.
 */
var FolderTitle = /** @class */ (function () {
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
    function FolderTitle(_a) {
        var title = _a.title, subtitle = _a.subtitle, folderName = _a.folderName, path = _a.path, hasPraesentation = _a.hasPraesentation;
        /**
         * The title. It is the first line in the file `titles.txt`.
         *
         * @type {String}
         */
        this.title = title;
        /**
         * The subtitle. It is the second line in the file `titles.txt`.
         *
         * @type {String}
         */
        this.subtitle = subtitle;
        /**
         * The name of the parent folder, for example `10_Konzertierende-Musiker`
         *
         * @type {String}
         */
        this.folderName = folderName;
        /**
         * The relative path of the folder inside the base path, for example
         * `12/10_Interpreten/10_Konzertierende-Musiker`.
         *
         * @type {String}
         */
        this.path = path;
        /**
         * True if the folder contains a file with the file name
         * `Praesentation.baldr.yml`
         *
         * @type {Boolean}
         */
        this.hasPraesentation = hasPraesentation;
    }
    return FolderTitle;
}());
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
var HierarchicalFolderTitles = /** @class */ (function () {
    /**
     * @param {String} filePath - The path of a file in a folder with `title.txt`
     *   files.
     */
    function HierarchicalFolderTitles(filePath) {
        this.titles_ = [];
        this.read_(filePath);
    }
    /**
     * Parse the `title.txt` text file. The first line of this file contains
     * the title, the second lines contains the subtitle.
     *
     * @param {String} filePath - The absolute path of a `title.txt` file.
     *
     * @private
     */
    HierarchicalFolderTitles.prototype.readTitleTxt_ = function (filePath) {
        var titleRaw = fs.readFileSync(filePath, { encoding: 'utf-8' });
        var titles = titleRaw.split('\n');
        var folderTitle = new FolderTitle({});
        if (titles.length > 0) {
            folderTitle.title = titles[0];
        }
        if (titles.length > 1 && titles[1]) {
            folderTitle.subtitle = titles[1];
        }
        if (fs.existsSync(path.join(path.dirname(filePath), 'Praesentation.baldr.yml'))) {
            folderTitle.hasPraesentation = true;
        }
        return folderTitle;
    };
    /**
     * Read all `title.txt` files. Descend to all parent folders which contain
     * a `title.txt` file.
     *
     * @param {String} filePath - The path of the presentation file.
     *
     * @private
     */
    HierarchicalFolderTitles.prototype.read_ = function (filePath) {
        // We need absolute paths. The cli gives us relative paths.
        filePath = path.resolve(filePath);
        // ['', 'var', 'data', 'baldr', 'media', '12', ..., 'Praesentation.baldr.yml']
        var segments = filePath.split(path.sep);
        // 10, 11
        var depth = segments.length;
        // 5
        var minDepth = config.mediaServer.basePath.split(path.sep).length;
        // To build the path property of the FolderTitle class.
        var folderNames = [];
        for (var index = minDepth + 1; index < depth; index++) {
            var folderName = segments[index - 1];
            folderNames.push(folderName);
            // [ '', 'var', 'data', 'baldr', 'media', '05' ]
            var pathSegments = segments.slice(0, index);
            // /var/data/baldr/media/05/title.txt
            // /var/data/baldr/media/05/20_Mensch-Zeit/title.txt
            // /var/data/baldr/media/05/20_Mensch-Zeit/10_Mozart/title.txt
            // /var/data/baldr/media/05/20_Mensch-Zeit/10_Mozart/20_Biographie-Salzburg-Wien/title.txt
            var titleTxt = __spreadArrays(pathSegments, ['title.txt']).join(path.sep);
            if (fs.existsSync(titleTxt)) {
                var folderTitle = this.readTitleTxt_(titleTxt);
                folderTitle.path = folderNames.join(path.sep);
                folderTitle.folderName = folderName;
                this.titles_.push(folderTitle);
            }
        }
    };
    Object.defineProperty(HierarchicalFolderTitles.prototype, "titlesArray_", {
        /**
         * An array of title strings.
         *
         * @type {array}
         * @private
         */
        get: function () {
            return this.titles_.map(function (folderTitle) { return folderTitle.title; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HierarchicalFolderTitles.prototype, "lastFolderTitleObject_", {
        /**
         * @private
         */
        get: function () {
            return this.titles_[this.titles_.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HierarchicalFolderTitles.prototype, "allTitles", {
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
        get: function () {
            return this.titlesArray_.join(' / ');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HierarchicalFolderTitles.prototype, "curriculumTitlesArray", {
        /**
         * Not the first and last title as a array.
         *
         * @type {Array}
         */
        get: function () {
            return this.titlesArray_.slice(1, this.titles_.length - 1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HierarchicalFolderTitles.prototype, "curriculum", {
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
        get: function () {
            return this.curriculumTitlesArray.join(' / ');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HierarchicalFolderTitles.prototype, "id", {
        /**
         * The parent directory name with the numeric prefix: For example
         * `Bachs-vergebliche-Reise`.
         *
         * @returns {String}
         */
        get: function () {
            return this.lastFolderTitleObject_.folderName.replace(/\d\d_/, '');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HierarchicalFolderTitles.prototype, "title", {
        /**
         * The title. It is the first line in the text file `title.txt` in the
         * same folder as the constructor `filePath` file.
         *
         * @returns {String}
         */
        get: function () {
            return this.lastFolderTitleObject_.title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HierarchicalFolderTitles.prototype, "subtitle", {
        /**
         * The subtitle. It is the second line in the text file `title.txt` in the
         * same folder as the constructor `filePath` file.
         *
         * @returns {String}
         */
        get: function () {
            if (this.lastFolderTitleObject_.subtitle) {
                return this.lastFolderTitleObject_.subtitle;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HierarchicalFolderTitles.prototype, "titleAndSubtitle", {
        /**
         * Combine the title and the subtitle (`Title - Subtitle`).
         *
         * @returns {String}
         */
        get: function () {
            if (this.subtitle)
                return this.title + " - " + this.subtitle;
            return this.title;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HierarchicalFolderTitles.prototype, "grade", {
        /**
         * The first folder level in the hierachical folder structure must be named
         * with numbers.
         *
         * @returns {string}
         */
        get: function () {
            return this.titles_[0].title.replace(/[^\d]+$/, '');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * List all `FolderTitle()` objects.
     *
     * @returns {Array}
     */
    HierarchicalFolderTitles.prototype.list = function () {
        return this.titles_;
    };
    return HierarchicalFolderTitles;
}());
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
var FolderTitleTree = /** @class */ (function () {
    function FolderTitleTree() {
        /**
         * @private
         */
        this.tree_ = {};
    }
    /**
     * Add one folder title to the tree.
     *
     * @param {module:@bldr/media-server/titles~HierarchicalFolderTitles} folderTitles
     */
    FolderTitleTree.prototype.add = function (folderTitles) {
        var tmp = this.tree_;
        var count = 1;
        for (var _i = 0, _a = folderTitles.list(); _i < _a.length; _i++) {
            var title = _a[_i];
            if (!(title.folderName in tmp)) {
                tmp[title.folderName] = {
                    _title: title
                };
                tmp[title.folderName]._title.level = count;
            }
            tmp = tmp[title.folderName];
            count += 1;
        }
    };
    /**
     * Get the tree.
     *
     * @returns {Object}
     */
    FolderTitleTree.prototype.get = function () {
        return this.tree_;
    };
    return FolderTitleTree;
}());
module.exports = {
    HierarchicalFolderTitles: HierarchicalFolderTitles,
    FolderTitleTree: FolderTitleTree
};
