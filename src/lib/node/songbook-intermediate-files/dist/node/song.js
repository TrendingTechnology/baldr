"use strict";
/**
 * Classes which represent a song.
 *
 * @module @bldr/songbook-intermediate-files/song
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntermediateSong = exports.ExtendedSong = void 0;
// Node packages.
const path = __importStar(require("path"));
const childProcess = __importStar(require("child_process"));
// Third party packages.
const fs = __importStar(require("fs-extra"));
// Project packages.
const songbook_core_1 = require("@bldr/songbook-core");
const log = __importStar(require("@bldr/log"));
const core_browser_1 = require("@bldr/core-browser");
const string_format_1 = require("@bldr/string-format");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const yaml_1 = require("@bldr/yaml");
const utils_1 = require("./utils");
const main_1 = require("./main");
const file_monitor_1 = require("./file-monitor");
const constants = songbook_core_1.songConstants;
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
            throw new Error(log.format('Song folder doesn’t exist: %s', [folder]));
        }
        this.folder = folder;
        const ymlFile = path.join(folder, this.yamlFile);
        if (!fs.existsSync(ymlFile)) {
            throw new Error(log.format('YAML file could not be found: %s', [ymlFile]));
        }
        this.rawYaml = (0, yaml_1.convertFromYamlRaw)(fs.readFileSync(ymlFile, 'utf8'));
        for (const key in this.rawYaml) {
            if (!this.allowedProperties.includes(key)) {
                throw new Error(log.format('Unsupported key: %s', [key]));
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
        if (this.wikidata != null) {
            const wikidataID = parseInt(this.wikidata);
            if (isNaN(wikidataID)) {
                throw new Error(log.format('Wikidata entry “%s” of song “%s” must be an number (without Q).', [this.title, this.wikidata]));
            }
        }
    }
    toJSON() {
        return Object.assign(this);
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
        this.folderIntermediateFiles = new Folder(this.folder, constants.intermediateFolder);
        this.mscxProjector = this.detectFile('projector.mscx');
        this.mscxPiano = this.detectFile('piano.mscx', 'lead.mscx');
        this.pianoFiles = (0, utils_1.listFiles)(this.folderIntermediateFiles.get(), constants.pianoRegExp);
        this.slidesFiles = (0, utils_1.listFiles)(this.folderIntermediateFiles.get(), constants.slideRegExp);
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
        throw new Error(log.format('File doesn’t exist: %s', [absPath]));
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
exports.ExtendedSong = ExtendedSong;
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
        const subFolder = path.join(this.abc, this.songId, constants.intermediateFolder, this.pianoFiles[index]);
        return main_1.PianoScore.texCmd('image', subFolder);
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
            throw new Error(log.format('The song “%s” has no EPS piano score files.', [
                this.metaData.title
            ]));
        }
        if (this.pianoFiles.length > 4) {
            throw new Error(log.format('The song “%s” has more than 4 EPS piano score files.', [
                this.metaData.title
            ]));
        }
        const template = `\n\\tmpmetadata
{%s} % title
{%s} % subtitle
{%s} % composer
{%s} % lyricist
`;
        const output = log.format(template, [
            main_1.PianoScore.sanitize(this.metaDataCombined.title),
            main_1.PianoScore.sanitize(this.metaDataCombined.subtitle),
            main_1.PianoScore.sanitize(this.metaDataCombined.composer),
            main_1.PianoScore.sanitize(this.metaDataCombined.lyricist)
        ]);
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
     * @param regExp - A string to filter the list of file names.
     * @param newMultipartFilename - The new base name of the multipart files.
     *
     * @returns An array of the renamed multipart files names.
     */
    renameMultipartFiles(folder, regExp, newMultipartFilename) {
        const intermediateFiles = (0, utils_1.listFiles)(folder, regExp);
        let no = 1;
        for (const oldName of intermediateFiles) {
            const newName = (0, string_format_1.formatMultiPartAssetFileName)(newMultipartFilename, no);
            fs.renameSync(path.join(folder, oldName), path.join(folder, newName));
            no++;
        }
        return (0, utils_1.listFiles)(folder, regExp);
    }
    generateMetaDataForMediaServer() {
        const yamlFilePath = path.join(this.folderIntermediateFiles.get(), 'Projektor.svg.yml');
        const oldMetaData = (0, file_reader_writer_1.readYamlFile)(yamlFilePath);
        let uuid;
        if ((oldMetaData === null || oldMetaData === void 0 ? void 0 : oldMetaData.uuid) != null) {
            uuid = oldMetaData.uuid;
        }
        else {
            uuid = (0, core_browser_1.genUuid)();
        }
        const newMetaData = this.metaDataCombined.toJSON();
        newMetaData.uuid = uuid;
        const metaData = Object.assign({ ref: `LD_${this.songId}` }, newMetaData);
        (0, file_reader_writer_1.writeYamlFile)(path.join(this.folderIntermediateFiles.get(), 'Projektor.svg.yml'), metaData);
    }
    /**
     * Generate SVG files in the slides subfolder.
     */
    generateSlides() {
        const subFolder = this.folderIntermediateFiles.get();
        const oldSVGs = (0, utils_1.listFiles)(subFolder, constants.slideRegExp);
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
        const result = this.renameMultipartFiles(subFolder, constants.slideRegExp, constants.firstSlideName);
        log.info('  Generate SVG files: %s', [result.toString()]);
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
        (0, utils_1.deleteFiles)(subFolder, /\.eps$/i);
        const pianoFile = path.join(subFolder, 'piano.mscx');
        fs.copySync(this.mscxPiano, pianoFile);
        childProcess.spawnSync('mscore-to-vector.sh', ['-e', pianoFile]);
        const result = this.renameMultipartFiles(subFolder, constants.pianoRegExp, constants.firstPianoName);
        log.info('  Generate EPS files: %s', [result.toString()]);
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
            (force ||
                file_monitor_1.fileMonitor.isModified(this.mscxProjector) ||
                this.slidesFiles.length === 0)) {
            this.generatePDF('projector');
            this.generateSlides();
        }
        log.info('Check if the MuseScore files of the Song “%s” have changed.', [
            log.colorize.green(this.songId)
        ]);
        // piano
        if ((mode === 'all' || mode === 'piano') &&
            (force ||
                file_monitor_1.fileMonitor.isModified(this.mscxPiano) ||
                this.pianoFiles.length === 0)) {
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
                log.info(message, [filePath]);
                fs.removeSync(filePath);
            }
        }
        removeFile('Remove temporary PDF file “%s”.', path.join(this.folder, 'projector.pdf'));
        removeFile('Remove old slides folder “%s”.', path.join(this.folder, 'slides'));
        removeFile('Remove old piano folder “%s”.', path.join(this.folder, 'piano'));
    }
}
exports.IntermediateSong = IntermediateSong;
