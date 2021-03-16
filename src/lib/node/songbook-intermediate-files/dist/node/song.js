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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedSong = void 0;
// Node packages.
const path = __importStar(require("path"));
// Third party packages.
const fs = __importStar(require("fs-extra"));
const js_yaml_1 = __importDefault(require("js-yaml"));
// Project packages.
const songbook_core_1 = require("@bldr/songbook-core");
const log = __importStar(require("@bldr/log"));
const utils_1 = require("./utils");
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
            // if (isNaN(wikidataID)) {
            //   throw new Error(
            //     log.format(
            //       'Wikidata entry “%s” of song “%s” must be an number (without Q).',
            //       this.title,
            //       this.wikidata
            //     )
            //   )
            // }
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
        this.pianoFiles = utils_1.listFiles(this.folderIntermediateFiles.get(), '.eps');
        this.slidesFiles = utils_1.listFiles(this.folderIntermediateFiles.get(), '.svg');
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
exports.ExtendedSong = ExtendedSong;
