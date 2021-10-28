/**
 * The type of the JSON object of the file `/etc/baldr.json`
 *
 * @module @bldr/type-definitions/config
 */
import * as MediaCategoriesTypes from './media-categories';
import { IconFontConfiguration } from './icon-font-generator';
interface ApiConfiguration {
    port: number;
}
interface MongoDbConfiguration {
    url: string;
    dbName: string;
    user: string;
    password: string;
}
interface DatabasesConfiguration {
    mongodb: MongoDbConfiguration;
}
/**
 * The HTTP configuration for the media server and the REST API.
 */
interface HttpConfiguration {
    /**
     * The username is only required for remote connections.
     */
    username: string;
    /**
     * The password is only required for remote connections.
     */
    password: string;
    /**
     * The local domain without `http://`, for example `localhost`.
     */
    domainLocal: string;
    /**
     * The remote domain without `https://`, for example `baldr.friedrich.rocks`.
     */
    domainRemote: string;
    /**
     * The base directory for content thats delivered over HTTP, for example
     * `/var/www/baldr`.
     */
    webRoot: string;
    /**
     * `www-data` on Debian based systems.
     */
    webServerUser: string;
    /**
     * `www-data` on Debian based systems.
     */
    webServerGroup: string;
}
interface MimeType {
    allowedExtensions: string[];
    targetExtension: string;
    color: string;
}
interface MimeTypes {
    [key: string]: MimeType;
}
interface MediaServerConfiguration {
    /**
     * `/data/school/Aktuell`
     */
    basePath: string;
    /**
     * `['/data/school/Archiv/']`
     */
    archivePaths: string[];
    /**
     * `serverway`
     */
    sshAliasRemote: string;
    /**
     * `/usr/bin/code`
     */
    editor: string;
    /**
     * `/usr/bin/nautilus`
     */
    fileManager: string;
    mimeTypes: MimeTypes;
    /**
     * A URL segment that is inserted between the hostname and the relative path
     * of the media assets. For example `http://localhost/media/05/Mozart.jpg`.
     * `media` is the `urlFillIn`.
     */
    urlFillIn: string;
}
interface SongbookConfiguration {
    path: string;
    vueAppPath: string;
}
interface WireConfiguration {
    port: number;
    localUri: string;
}
interface YoutubeConfiguration {
    /**
     * The API key to access the JSON api (use by the youtube downloader)
     */
    apiKey: string;
}
/**
 * The type defintions of the main configuration file of the Baldr
 * project.
 */
export interface Configuration {
    api: ApiConfiguration;
    /**
     * The file paths of then configuration paths.
     */
    configurationFileLocations: string[];
    databases: DatabasesConfiguration;
    http: HttpConfiguration;
    iconFont: IconFontConfiguration;
    /**
     * The path of the local development repository, for example
     * `/home/jf/git-repositories/github/Josef-Friedrich/baldr`.
     */
    localRepo: string;
    mediaServer: MediaServerConfiguration;
    songbook: SongbookConfiguration;
    wire: WireConfiguration;
    youtube: YoutubeConfiguration;
    /**
     * Use the command line utility `baldr categories` to patch the media
     * categories configurations into the json files at `/etc/baldr.json`
     */
    mediaCategories: MediaCategoriesTypes.Collection;
    /**
     * Subfolders are abbreviated with uppercase two letter names:
     *
     * ```js
     * {
     *   AB: 'Arbeitsblatt',
     *   BD: 'Bild'
     * }
     * ```
     */
    twoLetterAbbreviations: {
        [abbreviation: string]: string;
    };
    /**
     * Some configuration informations for the seating plan converter.
     */
    seatingPlan: {
        /**
         * Absolute file path of the Notenmanager’s mdb file.
         */
        notenmanagerMdbPath: string;
    };
    /**
     * Some meta (background) informations about the Baldr instance.
     */
    meta: {
        /**
         * The complete name of the teacher, for example `OStR Max Mustermann`.
         */
        teacher: string;
        /**
         * The name of the school, for example `Altes-Gymnasium, Auerbauch`.
         */
        school: string;
        /**
         * Public website for the computer science lessons. For example:
         * `https://josef-friedrich.github.io/informatik/`
         */
        computerScienceWebsite: string;
    };
}
export {};
