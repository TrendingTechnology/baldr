"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepTitle = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const folder_title_1 = require("./folder-title");
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
        let title;
        if (titles.length === 0) {
            throw new Error(`${filePath} is empty and has no title.`);
        }
        if (titles.length > 0) {
            title = titles[0];
        }
        if (title == null) {
            throw new Error(`No title found in title.txt ${filePath}.`);
        }
        let subtitle;
        if (titles.length > 1 && titles[1] != null && titles[1] !== '') {
            subtitle = titles[1];
        }
        let hasPraesentation = false;
        if (fs_1.default.existsSync(path_1.default.join(path_1.default.dirname(filePath), 'Praesentation.baldr.yml'))) {
            hasPraesentation = true;
        }
        const relPath = path_1.default.dirname(filePath);
        const folderName = path_1.default.basename(relPath);
        return new folder_title_1.FolderTitle({ title, subtitle, hasPraesentation, relPath, folderName });
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
     * Find all title.txt files (from the deepest to the shallowest title.txt)
     *
     * @param filePath A file path from which to descend into the folder
     *   structure.
     *
     * @returns An array with absolute file path. First the deepest title.txt
     *   file. Last the shallowest title.txt file.
     */
    findTitleTxt(filePath) {
        let parentDir;
        if (fs_1.default.existsSync(filePath) && fs_1.default.lstatSync(filePath).isDirectory()) {
            parentDir = filePath;
        }
        else {
            parentDir = path_1.default.dirname(filePath);
        }
        const segments = parentDir.split(path_1.default.sep);
        const titlePaths = [];
        let found = false;
        for (let index = segments.length; index >= 0; index--) {
            const pathSegments = segments.slice(0, index);
            // /media/05/20_Mensch-Zeit/10_Mozart/20_Biographie-Salzburg-Wien/title.txt
            // /media/05/20_Mensch-Zeit/10_Mozart/title.txt
            // /media/05/20_Mensch-Zeit/title.txt
            // /media/05/title.txt
            const titleTxt = this.generateTitleTxtPath(pathSegments);
            if (fs_1.default.existsSync(titleTxt)) {
                found = true;
                // Do not push “title.txt” in the parent working directory (without initial /).
                // Push only absolute paths
                if (titleTxt.indexOf(path_1.default.sep) === 0) {
                    titlePaths.push(titleTxt);
                }
            }
            else if (found) {
                break;
            }
        }
        return titlePaths.reverse();
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
        const titleTxtPaths = this.findTitleTxt(filePath);
        let level = 1;
        for (const titleTxtPath of titleTxtPaths) {
            const folderTitle = this.readTitleTxt(titleTxtPath);
            folderTitle.level = level++;
            this.titles.push(folderTitle);
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
    get ref() {
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
            ref: this.ref,
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