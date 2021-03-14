"use strict";
/**
 * This package bundles all objects functions together, which are used to
 * generate the intermediate files for the songbook. It has to be it’s own
 * package, because the dependency better-sqlite3 must be complied and that
 * causes trouble in the electron app.
 *
 * @module @bldr/songbook-intermediate-files
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildVueApp = exports.exportToMediaServer = exports.IntermediateLibrary = exports.PianoScore = void 0;
// Node packages.
const childProcess = __importStar(require("child_process"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
// Third party packages.
const fs = __importStar(require("fs-extra"));
const glob_1 = __importDefault(require("glob"));
const js_yaml_1 = __importDefault(require("js-yaml"));
// Project packages.
const songbook_core_1 = require("@bldr/songbook-core");
const log = __importStar(require("@bldr/log"));
const core_browser_1 = require("@bldr/core-browser");
/**
 * See `/etc/baldr.json`.
 */
const config_1 = __importDefault(require("@bldr/config"));
const file_monitor_1 = require("./file-monitor");
log.setLogLevel(3);
/*******************************************************************************
 * Functions
 ******************************************************************************/
function parseSongIDList(listPath) {
    const content = fs.readFileSync(listPath, { encoding: 'utf-8' });
    return content.split(/\s+/).filter(songId => songId);
}
/**
 * List files in a folder. You have to use a filter string to select the files.
 * The resulting array of file names is sorted.
 *
 * @param folderPath - The path of the directory.
 * @param filter - String to filter, e. g. “.eps”.
 *
 * @return An array of file names.
 */
function listFiles(folderPath, filter) {
    if (fs.existsSync(folderPath)) {
        return fs.readdirSync(folderPath).filter((file) => {
            return file.includes(filter);
        }).sort(undefined);
    }
    return [];
}
/**
 * Delete all files matching a filter string in a specified folder.
 *
 * @param folderPath - The path of the folder.
 * @param filter - String to filter, e. g. “.eps”.
 */
function deleteFiles(folderPath, filter) {
    const oldFiles = listFiles(folderPath, filter);
    for (const oldFile of oldFiles) {
        fs.unlinkSync(path.join(folderPath, oldFile));
    }
}
/*******************************************************************************
 * Utility classes
 ******************************************************************************/
/**
 * A wrapper class for a folder. If the folder does not exist, it will be
 * created during instantiation.
 */
class Folder {
    /**
     * @param folderPath - The path segments of the folder.
     */
    constructor(...folderPath) {
        this.folderPath = path.join(...arguments);
        if (!fs.existsSync(this.folderPath)) {
            fs.mkdirSync(this.folderPath, { recursive: true });
        }
    }
    /**
     * Return the path of the folder.
     */
    get() {
        return this.folderPath;
    }
    /**
     * Empty the folder (Delete all it’s files).
     */
    empty() {
        fs.removeSync(this.folderPath);
        fs.mkdirSync(this.folderPath);
    }
    /**
     * Remove the folder.
     */
    remove() {
        fs.removeSync(this.folderPath);
    }
}
/**
 * Metadata of a song catched from the info.yml file.
 *
 * info.yml
 *
 *     ---
 *     alias: I’m sitting here
 *     arranger: Josef Friedrich
 *     artist: Fools Garden
 *     composer: Heinz Müller / Manfred Meier
 *     country: Deutschland
 *     genre: Spiritual
 *     lyricist: Goethe
 *     musescore: https://musescore.com/user/12559861/scores/4801717
 *     source: http://wikifonia.org/node/9928/revisions/13488/view
 *     subtitle: A very good song
 *     title: Lemon tree
 *     year: 1965
 */
class ExtendedSongMetaData {
    /**
     * @param folder - Path of the song folder.
     */
    constructor(folder) {
        /**
         * The file name of the YAML file.
         */
        this.yamlFile = 'info.yml';
        /**
         * All in the YAML file “info.yml” allowed properties (keys).
         */
        this.allowedProperties = [
            'alias',
            'arranger',
            'artist',
            'audio',
            'composer',
            'country',
            'description',
            'genre',
            'lyricist',
            'musescore',
            'source',
            'subtitle',
            'title',
            'wikidata',
            'wikipedia',
            'year',
            'youtube'
        ];
        if (!fs.existsSync(folder)) {
            throw new Error(log.format('Song folder doesn’t exist: %s', folder));
        }
        this.folder = folder;
        const ymlFile = path.join(folder, this.yamlFile);
        if (!fs.existsSync(ymlFile)) {
            throw new Error(log.format('YAML file could not be found: %s', ymlFile));
        }
        this.rawYaml = js_yaml_1.default.load(fs.readFileSync(ymlFile, 'utf8'));
        for (const key in this.rawYaml) {
            if (!this.allowedProperties.includes(key)) {
                throw new Error(log.format('Unsupported key: %s', key));
            }
        }
        this.alias = this.rawYaml.alias;
        this.arranger = this.rawYaml.arranger;
        this.artist = this.rawYaml.artist;
        this.audio = this.rawYaml.audio;
        this.composer = this.rawYaml.composer;
        this.country = this.rawYaml.country;
        this.description = this.rawYaml.description;
        this.genre = this.rawYaml.genre;
        this.lyricist = this.rawYaml.lyricist;
        this.musescore = this.rawYaml.musescore;
        this.source = this.rawYaml.source;
        this.subtitle = this.rawYaml.subtitle;
        this.title = this.rawYaml.title;
        this.wikidata = this.rawYaml.wikidata;
        this.wikipedia = this.rawYaml.wikipedia;
        this.year = this.rawYaml.year;
        this.youtube = this.rawYaml.youtube;
        if (this.wikidata !== '') {
            const wikidataID = parseInt(this.wikidata);
            if (isNaN(wikidataID)) {
                throw new Error(log.format('Wikidata entry “%s” of song “%s” must be an number (without Q).', this.title, this.wikidata));
            }
        }
    }
    toJSON() {
        const output = {};
        if (this.alias !== '')
            output.alias = this.alias;
        if (this.arranger !== '')
            output.arranger = this.arranger;
        if (this.artist !== '')
            output.artist = this.artist;
        if (this.audio !== '')
            output.audio = this.audio;
        if (this.composer !== '')
            output.composer = this.composer;
        if (this.country !== '')
            output.country = this.country;
        if (this.description !== '')
            output.description = this.description;
        if (this.genre !== '')
            output.genre = this.genre;
        if (this.lyricist !== '')
            output.lyricist = this.lyricist;
        if (this.musescore !== '')
            output.musescore = this.musescore;
        if (this.source !== '')
            output.source = this.source;
        if (this.subtitle !== '')
            output.subtitle = this.subtitle;
        if (this.wikidata !== '')
            output.wikidata = this.wikidata;
        if (this.wikipedia !== '')
            output.wikipedia = this.wikipedia;
        if (this.year !== '')
            output.year = this.year;
        if (this.youtube !== '')
            output.youtube = this.youtube;
        return output;
    }
}
/**
 * One song
 */
class ExtendedSong {
    /**
     * @param songPath - The path of the directory containing the song
     * files or a path of a file inside the song folder (not nested in subfolders)
     */
    constructor(songPath) {
        this.folder = this.getSongFolder(songPath);
        this.abc = this.recognizeABCFolder(this.folder);
        this.songId = path.basename(this.folder);
        this.metaData = new ExtendedSongMetaData(this.folder);
        this.metaDataCombined = new songbook_core_1.SongMetaDataCombined(this.metaData);
        this.folderIntermediateFiles = new Folder(this.folder, 'NB');
        this.mscxProjector = this.detectFile('projector.mscx');
        this.mscxPiano = this.detectFile('piano.mscx', 'lead.mscx');
        this.pianoFiles = listFiles(this.folderIntermediateFiles.get(), '.eps');
        this.slidesFiles = listFiles(this.folderIntermediateFiles.get(), '.svg');
    }
    /**
     * Get the song folder.
     *
     * @param songPath - The path of the directory containing the song
     *   files or a path of a file inside the song folder (not nested in
     *   subfolders) or a non-existing song path.
     *
     * @return The path of the parent directory of the song.
     */
    getSongFolder(songPath) {
        try {
            const stat = fs.lstatSync(songPath);
            if (stat.isDirectory()) {
                return songPath;
            }
            else if (stat.isFile()) {
                return path.dirname(songPath);
            }
        }
        catch (error) { }
        return songPath.replace(`${path.sep}info.yml`, '');
    }
    /**
     * @param folder - The directory containing the song files.
     *
     * @return A single character
     */
    recognizeABCFolder(folder) {
        const pathSegments = folder.split(path.sep);
        const abc = pathSegments[pathSegments.length - 2];
        return abc;
    }
    /**
     * Detect a file inside the song folder. Throw an exception if the
     * file doesn’t exist.
     *
     * @param file - A filename of a file inside the song folder.
     *
     * @return A joined path of the file relative to the song collection
     *   base dir.
     */
    detectFile(...file) {
        let absPath;
        for (const argument of arguments) {
            absPath = path.join(this.folder, argument);
            if (fs.existsSync(absPath)) {
                return absPath;
            }
        }
        throw new Error(log.format('File doesn’t exist: %s', absPath));
    }
    toJSON() {
        return {
            abc: this.abc,
            folder: this.folder,
            metaData: this.metaData,
            songId: this.songId,
            slidesCount: this.slidesFiles.length
        };
    }
}
/**
 * Collect all songs of a song tree by walking through the folder tree
 * structur.
 *
 * @returns An object indexed with the song ID containing the song
 * objects.
 */
function collectSongs(basePath) {
    const songsPaths = glob_1.default.sync('info.yml', { cwd: basePath, matchBase: true });
    const songs = {};
    for (const songPath of songsPaths) {
        const song = new ExtendedSong(path.join(basePath, songPath));
        if (song.songId in songs) {
            throw new Error(log.format('A song with the same songId already exists: %s', song.songId));
        }
        songs[song.songId] = song;
    }
    return songs;
}
/*******************************************************************************
 * Classes for multiple songs
 ******************************************************************************/
/**
 * The song library - a collection of songs
 */
class Library extends songbook_core_1.CoreLibrary {
    /**
     * @param basePath - The base path of the song library
     */
    constructor(basePath) {
        super(collectSongs(basePath));
        this.basePath = basePath;
    }
    /**
     * Identify a song folder by searching for a file named “info.yml.”
     */
    detectSongs() {
        return glob_1.default.sync('info.yml', { cwd: this.basePath, matchBase: true });
    }
    /**
     * @param listFile
     *
     * @returns {object}
     */
    loadSongList(listFile) {
        const songIds = parseSongIDList(listFile);
        const songs = {};
        for (const songId of songIds) {
            if ({}.hasOwnProperty.call(this.songs, songId)) {
                songs[songId] = this.songs[songId];
            }
            else {
                throw new Error(log.format('There is no song with song ID “%s”', songId));
            }
        }
        this.songs = songs;
        return songs;
    }
}
/**
 * A text file.
 */
class TextFile {
    /**
     * @param path The path of the text file.
     */
    constructor(path) {
        this.path = path;
        this.flush();
    }
    /**
     * Append content to the text file.
     *
     * @param content - Content to append to the text file.
     */
    append(content) {
        fs.appendFileSync(this.path, content);
    }
    /**
     * Read the whole text file.
     */
    read() {
        return fs.readFileSync(this.path, { encoding: 'utf8' });
    }
    /**
     * Delete the content of the text file, not the text file itself.
     */
    flush() {
        fs.writeFileSync(this.path, '');
    }
    /**
     * Remove the text file.
     */
    remove() {
        fs.unlinkSync(this.path);
    }
}
/**
 * The piano score.
 *
 * Generate the TeX file for the piano version of the songbook. The page
 * orientation of the score is in the landscape format. Two
 * EPS files exported from MuseScore fit on one page. To avoid page breaks
 * within a song a piano accompaniment must not have more than four
 * EPS files.
 */
class PianoScore {
    constructor(library, groupAlphabetically = true, pageTurnOptimized = true) {
        /**
         * A temporary file path where the content of the TeX file gets stored.
         */
        this.texFile = new TextFile(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'baldr-songbook-')), 'songbook.tex'));
        this.library = library;
        this.groupAlphabetically = groupAlphabetically;
        this.pageTurnOptimized = pageTurnOptimized;
    }
    /**
     * Generate TeX markup. Generate a TeX command prefixed with \tmp.
     *
     * @param command
     * @param value
     *
     * @return A TeX markup, for example: \tmpcommand{value}\n
     */
    static texCmd(command, value) {
        let markupValue;
        if (value != null) {
            markupValue = `{${value}}`;
        }
        else {
            markupValue = '';
        }
        return `\\tmp${command}${markupValue}\n`;
    }
    static sanitize(markup) {
        return markup.replace('&', '\\&');
    }
    /**
     * Fill a certain number of pages with piano score files.
     *
     * @param countTree - Piano scores grouped by page number.
     * @param songs - An array of song objects.
     * @param pageCount - Number of pages to group together.
     *
     * @returns An array of song objects, which fit in a given page number
     */
    static selectSongs(countTree, songs, pageCount) {
        for (let i = pageCount; i > 0; i--) {
            if (!countTree.isEmpty()) {
                const song = countTree.shift(i);
                if (song != null) {
                    const missingPages = pageCount - i;
                    songs.push(song);
                    if (missingPages <= 0) {
                        return songs;
                    }
                    else {
                        return PianoScore.selectSongs(countTree, songs, missingPages);
                    }
                }
            }
        }
        return songs;
    }
    /**
     * Build the TeX markup of an array of song objects
     *
     * @param songs - An array of song objects.
     *
     * @return {string}
     */
    static buildSongList(songs, pageTurnOptimized = false) {
        const doublePages = [];
        if (pageTurnOptimized) {
            let firstPage = true;
            const countTree = new PianoFilesCountTree(songs);
            while (!countTree.isEmpty()) {
                // One page with two columns or two pages with 4 columns
                const doublePage = [];
                let maxPages = 4;
                let actualPages = 0;
                if (firstPage) {
                    maxPages = 2;
                    firstPage = false;
                }
                const songs = PianoScore.selectSongs(countTree, [], maxPages);
                for (const song of songs) {
                    actualPages = actualPages + song.pianoFiles.length;
                    doublePage.push(song.formatPianoTex());
                }
                // Do not add placeholder on the end of list.
                if (countTree.sumFiles() > maxPages) {
                    // Add placeholder for blank pages
                    const placeholder = PianoScore.texCmd('placeholder');
                    const countPlaceholders = maxPages - actualPages;
                    // To avoid empty entries in the list: We use join later on.
                    if (countPlaceholders > 0) {
                        for (let index = 0; index < countPlaceholders; index++) {
                            doublePage.push(placeholder);
                        }
                    }
                }
                doublePages.push(doublePage.join('\\tmpcolumnbreak\n'));
            }
        }
        else {
            for (const song of songs) {
                doublePages.push(song.formatPianoTex());
            }
        }
        return doublePages.join('\\tmpcolumnbreak\n');
    }
    /**
     * Build the TeX markup for all songs.
     *
     * @param {boolean} groupAlphabetically
     * @param {boolean} pageTurnOptimized
     *
     * @returns {string}
     */
    build() {
        const output = [];
        const songs = this.library.toArray();
        if (this.groupAlphabetically) {
            const abcTree = new songbook_core_1.AlphabeticalSongsTree(songs);
            Object.keys(abcTree).forEach((abc) => {
                output.push('\n\n' + PianoScore.texCmd('chapter', abc.toUpperCase()));
                output.push(PianoScore.buildSongList(abcTree[abc], this.pageTurnOptimized));
            });
        }
        else {
            output.push(PianoScore.buildSongList(songs, this.pageTurnOptimized));
        }
        return output.join('');
    }
    /**
     * Read the content of a text file.
     *
     * @param The name of the text (TeX) file inside this package
     */
    read(filename) {
        return fs.readFileSync(path.join(__dirname, filename), { encoding: 'utf8' });
    }
    spawnTex(texFile, cwd) {
        // Error on Mac OS: conversion of the eps files to pdf files doesn’t work.
        // not allowed in restricted mode.
        // --shell-escape
        const result = childProcess.spawnSync('lualatex', ['--shell-escape', texFile], {
            cwd: cwd,
            encoding: 'utf-8'
        });
        if (result.status !== 0) {
            throw new Error(result.stdout);
        }
    }
    /**
     * Compile the TeX file using lualatex and open the compiled pdf.
     */
    compile() {
        // Assemble the Tex markup.
        const style = this.read('style.tex');
        const mainTexMarkup = this.read('piano-all.tex');
        const songs = this.build();
        let texMarkup = mainTexMarkup.replace('//style//', style);
        texMarkup = texMarkup.replace('//songs//', songs);
        texMarkup = texMarkup.replace('//created//', new Date().toLocaleString());
        texMarkup = texMarkup.replace('//basepath//', this.library.basePath);
        // Write contents to the text file.
        log.info('The TeX markup was written to: %s', // Do not change text: This will break tests.
        this.texFile.path // No color: This will break tests.
        );
        this.texFile.append(texMarkup);
        // To avoid temporary TeX files in the working directory of the shell
        // the command is running from.
        const cwd = path.dirname(this.texFile.path);
        // Compile the TeX file
        // Compile twice for the table of contents
        // The page numbers in the toc only matches after three runs.
        for (let index = 0; index < 3; index++) {
            log.info('Compile the TeX file “%s” the %d time.', this.texFile.path, index + 1);
            this.spawnTex(this.texFile.path, cwd);
        }
        // Open the pdf file.
        const pdfFile = this.texFile.path.replace('.tex', '.pdf');
        let openCommand;
        if (os.platform() === 'darwin') {
            openCommand = 'open';
        }
        else {
            openCommand = 'xdg-open';
        }
        const child = childProcess.spawn(openCommand, [pdfFile], { detached: true, stdio: 'ignore' });
        child.unref();
    }
}
exports.PianoScore = PianoScore;
/**
 * Extended version of the Song class to build intermediate files.
 */
class IntermediateSong extends ExtendedSong {
    /**
     * Format one image file of a piano score in the TeX format.
     *
     * @param index - The index number of the array position
     *
     * @return TeX markup for one EPS image file of a piano score.
     */
    formatPianoTeXEpsFile(index) {
        const subFolder = path.join(this.abc, this.songId, 'piano', this.pianoFiles[index]);
        return PianoScore.texCmd('image', subFolder);
    }
    /**
     * Generate TeX markup for one song.
     *
     * @return {string} TeX markup for a single song.
     * <code><pre>
     * \tmpmetadata
     * {title} % title
     * {subtitle} % subtitle
     * {composer} % composer
     * {lyricist} % lyricist
     * \tmpimage{s/Swing-low/piano/piano_1.eps}
     * \tmpimage{s/Swing-low/piano/piano_2.eps}
     * \tmpimage{s/Swing-low/piano/piano_3.eps}
     * </pre><code>
     */
    formatPianoTex() {
        if (this.pianoFiles.length === 0) {
            throw new Error(log.format('The song “%s” has no EPS piano score files.', this.metaData.title));
        }
        if (this.pianoFiles.length > 4) {
            throw new Error(log.format('The song “%s” has more than 4 EPS piano score files.', this.metaData.title));
        }
        const template = `\n\\tmpmetadata
{%s} % title
{%s} % subtitle
{%s} % composer
{%s} % lyricist
`;
        const output = log.format(template, PianoScore.sanitize(this.metaDataCombined.title), PianoScore.sanitize(this.metaDataCombined.subtitle), PianoScore.sanitize(this.metaDataCombined.composer), PianoScore.sanitize(this.metaDataCombined.lyricist));
        const epsFiles = [];
        for (let i = 0; i < this.pianoFiles.length; i++) {
            epsFiles.push(this.formatPianoTeXEpsFile(i));
        }
        return output + epsFiles.join('\\tmpcolumnbreak\n');
    }
    /**
     * Generate form a given *.mscx file a PDF file.
     *
     * @param source - Name of the *.mscx file without the extension.
     * @param destination - Name of the PDF without the extension.
     */
    generatePDF(source, destination = '') {
        if (destination === '') {
            destination = source;
        }
        const pdf = path.join(this.folderIntermediateFiles.get(), destination + '.pdf');
        childProcess.spawnSync('mscore', [
            '--export-to',
            path.join(pdf),
            path.join(this.folder, source + '.mscx')
        ]);
        if (fs.existsSync(pdf)) {
            return destination + '.pdf';
        }
    }
    /**
     * Rename an array of multipart media files to follow the naming scheme `_noXXX.extension`.
     *
     * @param folder - The folder containing the files to be renamed.
     * @param filter - A string to filter the list of file names.
     * @param newMultipartFilename - The new base name of the multipart files.
     *
     * @returns An array of the renamed multipart files names.
     */
    renameMultipartFiles(folder, filter, newMultipartFilename) {
        const intermediateFiles = listFiles(folder, filter);
        let no = 1;
        for (const oldName of intermediateFiles) {
            const newName = core_browser_1.formatMultiPartAssetFileName(newMultipartFilename, no);
            fs.renameSync(path.join(folder, oldName), path.join(folder, newName));
            no++;
        }
        return listFiles(folder, filter);
    }
    /**
     * Generate SVG files in the slides subfolder.
     */
    generateSlides() {
        const subFolder = this.folderIntermediateFiles.get();
        const oldSVGs = listFiles(subFolder, '.svg');
        for (const oldSVG of oldSVGs) {
            fs.unlinkSync(path.join(subFolder, oldSVG));
        }
        const src = path.join(subFolder, 'projector.pdf');
        childProcess.spawnSync('pdf2svg', [
            src,
            path.join(subFolder, '%02d.svg'),
            'all'
        ]);
        fs.unlinkSync(src);
        const result = this.renameMultipartFiles(subFolder, '.svg', 'Projektor.svg');
        log.info('Generate SVG files: %s', result);
        if (result.length === 0) {
            throw new Error('The SVG files for the slides couldn’t be generated.');
        }
        this.slidesFiles = result;
        return result;
    }
    /**
     * Generate EPS files for the piano score from the MuseScore file
     * “piano/piano.mscx” .
     *
     * @return An array of EPS piano score filenames.
     */
    generatePiano() {
        const subFolder = this.folderIntermediateFiles.get();
        deleteFiles(subFolder, '.eps');
        const pianoFile = path.join(subFolder, 'piano.mscx');
        fs.copySync(this.mscxPiano, pianoFile);
        childProcess.spawnSync('mscore-to-vector.sh', ['-e', pianoFile]);
        const result = this.renameMultipartFiles(subFolder, '.eps', 'Piano.eps');
        log.info('Generate EPS files: %s', result);
        if (result.length === 0) {
            throw new Error('The EPS files for the piano score couldn’t be generated.');
        }
        this.pianoFiles = result;
        return result;
    }
    /**
     * Wrapper method for all process methods of one song folder.
     *
     * @param mode - Generate all intermediate media files or only slide
     *   and piano files. Possible values: “all”, “slides” or “piano”
     * @param force - Force the regeneration of intermediate files.
     */
    generateIntermediateFiles(mode = 'all', force = false) {
        // slides
        if ((mode === 'all' || mode === 'slides') &&
            (force || file_monitor_1.fileMonitor.isModified(this.mscxProjector) || (this.slidesFiles.length === 0))) {
            this.generatePDF('projector');
        }
        log.info('Generate intermediate files for the Song “%s”.', this.songId);
        // piano
        if ((mode === 'all' || mode === 'piano') &&
            (force || file_monitor_1.fileMonitor.isModified(this.mscxPiano) || (this.pianoFiles.length === 0))) {
            this.generatePiano();
        }
    }
    /**
     * Delete all generated intermediate files of a song folder.
     */
    cleanIntermediateFiles() {
        this.folderIntermediateFiles.remove();
        function removeFile(message, filePath) {
            if (fs.existsSync(filePath)) {
                log.info(message, filePath);
                fs.removeSync(filePath);
            }
        }
        removeFile('Remove temporary PDF file “%s”.', path.join(this.folder, 'projector.pdf'));
        removeFile('Remove old slides folder “%s”.', path.join(this.folder, 'slides'));
        removeFile('Remove old piano folder “%s”.', path.join(this.folder, 'piano'));
    }
}
/**
 * An object that groups songs that have the same number of piano files.
 *
 * This tree object is an helper object. It is necessary to avoid page breaks
 * on multipage piano scores.
 *
 * <pre><code>
 * {
 *   "1": [ 1-page-song, 1-page-song ... ],
 *   "2": [ 2-page-song ... ],
 *   "3": [ 3-page-song ... ]
 *   "3": [ 3-page-song ... ]
 * }
 * </code></pre>
 */
class PianoFilesCountTree {
    /**
     * @param songs - An array of song objects.
     */
    constructor(songs) {
        this.validCounts = [1, 2, 3, 4];
        this.cache = {
            1: [],
            2: [],
            3: [],
            4: []
        };
        this.build(songs);
    }
    /**
     * @param count - 1, 2, 3, 4
     */
    checkCount(count) {
        if (this.validCounts.includes(count)) {
            return true;
        }
        else {
            throw new Error(log.format('Invalid piano file count: %s', count));
        }
    }
    /**
     * @param songs - An array of song objects.
     */
    build(songs) {
        for (const song of songs) {
            const count = song.pianoFiles.length;
            if (!(count in this))
                this.cache[count] = [];
            this.cache[count].push(song);
        }
    }
    /**
     * Sum up the number of all songs in all count categories.
     */
    sum() {
        let count = 0;
        for (const validCount of this.validCounts) {
            if ({}.hasOwnProperty.call(this, validCount)) {
                count = count + this.cache[validCount].length;
            }
        }
        return count;
    }
    /**
     * Sum up the number of files of all songs in all count categories.
     */
    sumFiles() {
        let count = 0;
        for (const validCount of this.validCounts) {
            if ({}.hasOwnProperty.call(this.cache, validCount)) {
                count += validCount * this.cache[validCount].length;
            }
        }
        return count;
    }
    /**
     * Return true if the count tree has no songs.
     *
     * @return {boolean}
     */
    isEmpty() {
        if (this.sum() === 0) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Shift the array of songs that has ”count” number of piano files.
     *
     * @param count - 1, 2, 3, 4
     *
     * @returns Song
     */
    shift(count) {
        this.checkCount(count);
        if ({}.hasOwnProperty.call(this, count))
            return this.cache[count].shift();
    }
}
class IntermediateLibrary extends Library {
    /**
     * @param basePath - The base path of the song library
     */
    constructor(basePath) {
        super(basePath);
        this.songs = this.collectSongs();
        this.songs = this.collectSongs();
    }
    /**
     * Execute git pull if repository exists.
     */
    gitPull() {
        if (fs.existsSync(path.join(this.basePath, '.git'))) {
            return childProcess.spawnSync('git', ['pull'], { cwd: this.basePath });
        }
    }
    collectSongs() {
        const songs = {};
        for (const songPath of this.detectSongs()) {
            const song = new IntermediateSong(path.join(this.basePath, songPath));
            if (song.songId in songs) {
                throw new Error(log.format('A song with the same songId already exists: %s', song.songId));
            }
            songs[song.songId] = song;
        }
        return songs;
    }
    /**
     * Delete multiple files.
     *
     * @param files - An array of files to delete.
     */
    deleteFiles(files) {
        files.forEach((filePath) => {
            fs.removeSync(path.join(this.basePath, filePath));
        });
    }
    /**
     * Clean all intermediate media files.
     */
    cleanIntermediateFiles() {
        for (const songId in this.songs) {
            this.songs[songId].cleanIntermediateFiles();
        }
        glob_1.default.sync('**/.*.mscx,', { cwd: this.basePath }).forEach(relativePath => {
            const tmpMscx = path.join(this.basePath, relativePath);
            log.info('Delete temporary MuseScore file: %s', tmpMscx);
            fs.unlinkSync(tmpMscx);
        });
        this.deleteFiles([
            'songs.tex',
            'filehashes.db'
        ]);
    }
    /**
     * Calls the method generateIntermediateFiles on each song
     *
     * @param mode - Generate all intermediate media files or only slide
     *   and piano files. Possible values: “all”, “slides” or “piano”
     * @param force - Force the regeneration of intermediate files.
     */
    generateIntermediateFiles(mode = 'all', force = false) {
        for (const songId in this.songs) {
            const song = this.songs[songId];
            song.generateIntermediateFiles(mode, force);
        }
    }
    /**
     * Generate all intermediate media files for one song.
     *
     * @param folder - The path of the parent song folder.
     * @param mode - Generate all intermediate media files or only slide
     *   and piano files. Possible values: “all”, “slides” or “piano”
     */
    updateSongByPath(folder, mode = 'all') {
        // To throw an error if the folder doesn’t exist.
        fs.lstatSync(folder);
        const song = new IntermediateSong(folder);
        song.generateIntermediateFiles(mode, true);
    }
    /**
     * Generate all intermediate media files for one song.
     *
     * @param songId - The ID of the song (the name of the parent song folder)
     * @param {string} mode - Generate all intermediate media files or only slide
     *   and piano files. Possible values: “all”, “slides” or “piano”
     */
    updateSongBySongId(songId, mode = 'all') {
        let song;
        if ({}.hasOwnProperty.call(this.songs, songId)) {
            song = this.songs[songId];
        }
        else {
            throw new Error(log.format('The song with the song ID “%s” is unkown.', songId));
        }
        song.generateIntermediateFiles(mode, true);
    }
    /**
     * Update the whole song library.
     *
     * @param mode - Generate all intermediate media files or only slide
     *   and piano files. Possible values: “all”, “slides” or “piano”
     * @param force - Force the regeneration of intermediate files.
     */
    update(mode = 'all', force = false) {
        if (!['all', 'slides', 'piano'].includes(mode)) {
            throw new Error('The parameter “mode” must be one of this strings: ' +
                '“all”, “slides” or “piano”.');
        }
        this.gitPull();
        this.generateIntermediateFiles(mode, force);
    }
}
exports.IntermediateLibrary = IntermediateLibrary;
/**
 * Export the intermediate SVG files to the media server. Adjust the
 * `info.yml` and copy it to the destination folder of the media server.
 */
function exportToMediaServer(library) {
    // NB = Notenbeispiele -> SVG
    // /var/data/baldr/media/Lieder/NB
    // There exists a folder for the audio files: HB (Hörbeispiele)
    const dirBase = path.join(config_1.default.mediaServer.basePath, 'Lieder', 'NB');
    try {
        fs.rmdirSync(dirBase);
    }
    catch (error) { }
    fs.ensureDirSync(dirBase);
    function exportSong(song) {
        // /var/data/baldr/media/Lieder/NB/a
        const dirAbc = path.join(dirBase, song.abc);
        fs.ensureDirSync(dirAbc);
        const firstFileName = path.join(dirAbc, `${song.songId}.svg`);
        // song.slidesFiles: ['01.svg', '02.svg']
        for (let index = 0; index < song.slidesFiles.length; index++) {
            const src = path.join(song.folderIntermediateFiles.get(), song.slidesFiles[index]);
            const dest = core_browser_1.formatMultiPartAssetFileName(firstFileName, index + 1);
            fs.copySync(src, dest);
            log.info('Copy %s to %s.', src, dest);
        }
        const rawYaml = song.metaData.rawYaml;
        rawYaml.id = `Lied_${song.songId}_NB`;
        rawYaml.title = `Lied „${song.metaData.title}“`;
        // for (const property of song.metaDataCombined.allProperties) {
        //   if (song.metaDataCombined[property]) {
        //     rawYaml[`${convertCamelToSnake(property)}_combined`] = song.metaDataCombined[property]
        //   }
        // }
        const yamlMarkup = ['---', js_yaml_1.default.dump(rawYaml, core_browser_1.jsYamlConfig)];
        fs.writeFileSync(`${firstFileName}.yml`, yamlMarkup.join('\n'));
    }
    for (const song of library.toArray()) {
        exportSong(song);
    }
}
exports.exportToMediaServer = exportToMediaServer;
/**
 * Build the Vue app. All image files must be copied into the Vue working
 * directory.
 */
function buildVueApp() {
    const process = childProcess.spawnSync('npm', ['run', 'build'], {
        cwd: config_1.default.songbook.vueAppPath,
        encoding: 'utf-8',
        shell: true
    });
    log.info(process.stdout);
    log.error(process.stderr);
}
exports.buildVueApp = buildVueApp;