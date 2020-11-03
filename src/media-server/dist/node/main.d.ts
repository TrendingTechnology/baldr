#! /usr/bin/env node
export const asciify: typeof import("@bldr/media-manager").asciify;
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
export const deasciify: typeof import("@bldr/media-manager").deasciify;
export const TitleTree: typeof import("@bldr/media-manager").TitleTree;
/**
 * Get the extension from a file path.
 *
 * @param {String} filePath
 *
 * @returns {String}
 */
export function getExtension(filePath: string): string;
/**
 * This object hold jsons for displaying help messages in the browser on
 * some entry point urls.
 *
 * Update docs on the top of this file in the JSDoc block.
 *
 * @type {Object}
 */
export const helpMessages: any;
export const DeepTitle: typeof import("@bldr/media-manager").DeepTitle;
export const metaTypes: {
    detectTypeByPath: (filePath: string) => string;
    formatFilePath: (data: import("../../config/node_modules/@bldr/type-definitions/dist/node/asset.js").AssetType.FileFormat, oldPath?: string) => string;
    process: (data: import("../../config/node_modules/@bldr/type-definitions/dist/node/asset.js").AssetType.Generic) => import("../../config/node_modules/@bldr/type-definitions/dist/node/asset.js").AssetType.Generic;
    typeSpecs: {
        cloze: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        composition: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        cover: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        group: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        instrument: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        person: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        photo: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        radio: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        recording: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        reference: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        score: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        song: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        worksheet: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        youtube: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
        general: import("../../config/node_modules/@bldr/type-definitions/dist/node/meta-spec.js").MetaSpec.Type;
    };
    mergeTypeNames: (...typeName: string[]) => string;
};
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
export function registerMediaRestApi(): import("express-serve-static-core").Express;
/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param {Number} port - A TCP port.
 */
export function runRestApi(port: number): Promise<import("express-serve-static-core").Express>;
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
    id: string;
    title: string;
}
export {};
