/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions/config
 */
interface DocConfiguration {
    src: string;
    dest: string;
    configFile: string;
}
interface SongbookConfiguration {
    path: string;
    projectorPath: string;
    pianoPath: string;
    vueAppPath: string;
}
interface HttpConfiguration {
    username: string;
    password: string;
    domainLocal: string;
    domainRemote: string;
    webRoot: string;
    webServerUser: string;
    webServerGroup: string;
}
interface AssetType {
    allowedExtensions: string[];
    targetExtension: string;
    color: string;
}
interface AssetTypes {
    [key: string]: AssetType;
}
interface MediaServerConfiguration {
    basePath: string;
    archivePaths: string[];
    sshAliasRemote: string;
    editor: string;
    fileManager: string;
    assetTypes: AssetTypes;
}
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
    doc: DocConfiguration;
    songbook: SongbookConfiguration;
    localRepo: string;
    http: HttpConfiguration;
    mediaServer: MediaServerConfiguration;
    api: ApiConfiguration;
    databases: DatabasesConfiguration;
    wire: WireConfiguration;
    youtube: YoutubeConfiguration;
}
export {};
