"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepTitle = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const folder_title_1 = require("./folder-title");
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
        let hasPresentation = false;
        if (fs_1.default.existsSync(path_1.default.join(path_1.default.dirname(filePath), 'Praesentation.baldr.yml'))) {
            hasPresentation = true;
        }
        const relPath = path_1.default.dirname(filePath);
        const folderName = path_1.default.basename(relPath);
        return new folder_title_1.FolderTitle({
            title,
            subtitle,
            hasPresentation,
            relPath,
            folderName
        });
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
     * @returns An array with absolute file paths. First the deepest title.txt
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
     * For example: `Fach Musik / 5. Jahrgangsstufe / Lernbereich 4: Musik und
     * ihre Grundlagen / Instrumente verschiedener Gruppen / Hör-Labyrinth`
     */
    get allTitles() {
        return this.titlesArray.join(' / ');
    }
    get curriculumTitlesArray() {
        return this.titlesArray.slice(1, this.titles.length - 1);
    }
    /**
     * For example: `5. Jahrgangsstufe / Lernbereich 4: Musik und ihre Grundlagen
     * / Instrumente verschiedener Gruppen`
     */
    get curriculum() {
        return this.curriculumTitlesArray.join(' / ');
    }
    get curriculumTitlesArrayFromGrade() {
        return this.titlesArray.slice(this.gradeIndexPosition + 1, this.titles.length - 1);
    }
    /**
     * `Lernbereich 4: Musik und ihre Grundlagen / Instrumente verschiedener Gruppen`
     */
    get curriculumFromGrade() {
        return this.curriculumTitlesArrayFromGrade.join(' / ');
    }
    /**
     * The subject without the prefix `Fach `. For example `Musik` or `Informatik`.
     * German: `Unterrichtsfach`.
     */
    get subject() {
        return this.titles[0].title.replace('Fach ', '');
    }
    /**
     * For example: `Hoer-Labyrinth`. An automatically generated reference string. The reference is identical
     * to the last folder name without the prefix `\d\d_`.
     */
    get ref() {
        return this.lastFolderTitleObject.folderName.replace(/\d\d_/, '');
    }
    /**
     * The title of the last folder title object.
     */
    get title() {
        return this.lastFolderTitleObject.title;
    }
    /**
     * The subtitle of the last folder title object.
     */
    get subtitle() {
        if (this.lastFolderTitleObject.subtitle != null) {
            return this.lastFolderTitleObject.subtitle;
        }
    }
    /**
     * `Title - Subtitle`
     */
    get titleAndSubtitle() {
        if (this.subtitle != null)
            return `${this.title} - ${this.subtitle}`;
        return this.title;
    }
    /**
     * Get the index number of the folder title object containing “X. Jahrgangsstufe”.
     */
    get gradeIndexPosition() {
        let i = 0;
        for (const folderTitle of this.titles) {
            if (folderTitle.title.match(/^\d+\. *Jahrgangsstufe$/) != null) {
                return i;
            }
            i++;
        }
        throw new Error(`“X. Jahrgangsstufe” not found in the titles: ${this.allTitles}`);
    }
    get grade() {
        return parseInt(this.titles[this.gradeIndexPosition].title.replace(/[^\d]+$/, ''));
    }
    list() {
        return this.titles;
    }
    getFolderTitleByFolderName(folderName) {
        for (const folderTitle of this.titles) {
            if (folderTitle.folderName === folderName) {
                return folderTitle;
            }
        }
    }
    generatePresetationMeta() {
        const result = {
            ref: this.ref,
            subtitle: this.subtitle,
            title: this.title,
            grade: this.grade,
            curriculum: this.curriculum
        };
        if (result.subtitle == null || result.subtitle === '') {
            delete result.subtitle;
        }
        return result;
    }
}
exports.DeepTitle = DeepTitle;
