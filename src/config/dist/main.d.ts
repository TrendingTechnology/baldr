/**
 * Load the configuration file /etc/baldr.json.
 *
 * @module @bldr/config
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
    port: string;
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
    port: string;
    localUri: string;
}
/**
 * The main configuration file of the Baldr project.
 */
interface Configuration {
    doc: DocConfiguration;
    songbook: SongbookConfiguration;
    localRepo: string;
    http: HttpConfiguration;
    mediaServer: MediaServerConfiguration;
    api: ApiConfiguration;
    databases: DatabasesConfiguration;
    wire: WireConfiguration;
}
/**
 * Object to cache the configuration. To avoid reading the configuration
 * file multiple times.
 */
declare const config: Configuration;
export = config;
