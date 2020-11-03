#! /usr/bin/env node
export const asciify: any;
/**
 * This class is used both for the entries in the MongoDB database as well for
 * the queries.
 */
export class Asset extends MediaFile {
    /**
     * @param {string} filePath - The file path of the media file.
     */
    constructor(filePath: string);
    /**
     * The absolute path of the info file in the YAML format. On the absolute
     * media file path `.yml` is appended.
     * @type {string}
     */
    infoFile_: string;
    /**
     * Indicates if the asset has a preview image.
     * @type {Boolean}
     */
    previewImage: boolean;
    assetType: string;
    /**
     * Search for mutlipart assets. The naming scheme of multipart assets is:
     * `filename.jpg`, `filename_no002.jpg`, `filename_no003.jpg`
     */
    detectMultiparts_(): void;
    /**
     * The count of parts of a multipart asset.
     *
     * @type {Number}
     */
    multiPartCount: number;
}
export const mediaCategoriesManager: import("@bldr/core-browser").MediaCategoriesManager;
export const deasciify: any;
export const TitleTree: any;
/**
 * Get the extension from a file path.
 *
 * @param {String} filePath
 *
 * @returns {String}
 */
export function getExtension(filePath: string): string;
export const helper: {
    asciify: (input: string) => string;
    idify: (input: string) => string;
    deasciify: (input: string) => string;
};
/**
 * This object hold jsons for displaying help messages in the browser on
 * some entry point urls.
 *
 * Update docs on the top of this file in the JSDoc block.
 *
 * @type {Object}
 */
export const helpMessages: any;
export const DeepTitle: any;
export const metaTypes: any;
/**
 * Mirror the folder structure of the media folder into the archive folder or
 * vice versa. Only folders with two prefixed numbers followed by an
 * underscore (for example “10_”) are mirrored.
 *
 * @param {String} currentPath - Must be a relative path within one of the
 *   folder structures.
 *
 * @returns {Object} - Status informations of the action.
 */
export function mirrorFolderStructure(currentPath: string): any;
/**
 * Open the current path multiple times.
 *
 * 1. In the main media server directory
 * 2. In a archive directory structure.
 * 3. In a second archive directory structure ... and so on.
 *
 * @param {String} currentPath
 * @param {Boolean} create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
export function openFolderWithArchives(currentPath: string, create: boolean): {};
/**
 * Open a file path with an executable.
 *
 * To launch apps via the REST API the systemd unit file must run as
 * the user you login in in your desktop environment. You also have to set
 * to environment variables: `DISPLAY=:0` and
 * `DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$UID/bus`
 *
 * ```
 * Environment=DISPLAY=:0
 * Environment=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
 * User=1000
 * Group=1000
 * ```
 *
 * @param {String} executable - Name or path of an executable.
 * @param {String} filePath - The path of a file or a folder.
 *
 * @see node module on npmjs.org “open”
 * @see {@link https://unix.stackexchange.com/a/537848}
 */
export function openWith(executable: string, filePath: string): void;
/**
 * Register the express js rest api in a giant function.
 */
export function registerMediaRestApi(): any;
/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param {Number} port - A TCP port.
 */
export function runRestApi(port: number): Promise<any>;
/**
 * Base class to be extended.
 */
declare class MediaFile {
    constructor(filePath: any);
    /**
     * Absolute path ot the file.
     * @type {string}
     * @access protected
     */
    absPath_: string;
    /**
     * Relative path ot the file.
     * @type {string}
     */
    path: string;
    /**
     * The basename (filename) of the file.
     * @type {string}
     */
    filename: string;
    /**
     * @access protected
     */
    addFileInfos_(): MediaFile;
    /**
     * The file size in bytes.
     * @type {number}
     */
    size: number;
    /**
     * The timestamp indicating the last time this file was modified
     * expressed in milliseconds since the POSIX Epoch.
     * @type {Number}
     */
    timeModified: number;
    /**
     * The extension of the file.
     * @type {string}
     */
    extension: string;
    /**
     * The basename (filename without extension) of the file.
     * @type {string}
     * @private
     */
    private basename_;
    /**
     * Parse the info file of a media asset or the presenation file itself.
     *
     * Each media file can have a info file that stores additional
     * metadata informations.
     *
     * File path:
     * `/home/baldr/beethoven.jpg`
     *
     * Info file in the YAML file format:
     * `/home/baldr/beethoven.jpg.yml`
     *
     * @param {string} filePath - The path of the YAML file.
     *
     * @returns {object}
     *
     * @access protected
     */
    readYaml_(filePath: string): object;
    /**
     * Add metadata from the file system, like file size or timeModifed.
     */
    addFileInfos(): MediaFile;
    /**
     * Delete the temporary properties of the object. Temporary properties end
     * with `_`.
     */
    cleanTmpProperties(): MediaFile;
    /**
     * Merge an object into the class object. Properties can be in the
     * `snake_case` or `kebab-case` form. They are converted into `camelCase` in a
     * recursive fashion.
     *
     * @param {object} properties - Add an object to the class properties.
     */
    importProperties(properties: object): void;
    /**
     * Prepare the object for the insert into the MongoDB database
     * Generate `id` and `title` if this properties are not present.
     */
    prepareForInsert(): MediaFile;
    id: any;
    title: any;
}
export {};
