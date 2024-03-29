import mongodb from 'mongodb';
import { ApiTypes, TitlesTypes } from '@bldr/type-definitions';
interface ClientWrapper {
    connect: () => Promise<DatabaseWrapper>;
    close: () => Promise<void>;
}
interface DatabaseWrapper {
    initialize: () => Promise<any>;
    getDocumentCounts: () => Promise<ApiTypes.MediaCount>;
    getFolderTitleTree: () => Promise<TitlesTypes.TreeTitleList>;
    listUpdateTasks: () => Promise<ApiTypes.MediaUpdateTask[]>;
    getAllAssetUris: () => Promise<string[]>;
}
export declare class MongoDbClient implements ClientWrapper {
    private readonly client;
    private database?;
    constructor();
    /**
     * Connect to the MongoDB database as a client, create a database wrapper object and
     * initialize the database.
     */
    connect(): Promise<DatabaseWrapper>;
    close(): Promise<void>;
}
/**
 * Connect to the MongoDB server.
 */
export declare function connectDb(): Promise<mongodb.MongoClient>;
/**
 * Connect and initialize the MongoDB database.
 */
export declare function getDatabaseWrapper(): Promise<Database>;
export interface FlushMediaResult {
    numberOfDroppedAssets: number;
    numberOfDroppedPresentations: number;
}
/**
 * A wrapper around MongoDB.
 */
export declare class Database implements DatabaseWrapper {
    private readonly schema;
    db: mongodb.Db;
    private isInitialized;
    constructor(db: mongodb.Db);
    /**
     * @TODO Remove
     */
    connect(): Promise<void>;
    /**
     * List all collection names in an array.
     *
     * @returns An array of collection names.
     */
    listCollectionNames(): Promise<string[]>;
    /**
     * Create the collections with indexes.
     */
    initialize(): Promise<ApiTypes.DbInitResult>;
    /**
     * Drop all collections except collection which defined `{drop: false}` in
     * `this.schema`
     */
    drop(): Promise<ApiTypes.DbDroppedCollections>;
    /**
     * Reinitialize the MongoDB database (Drop all collections and initialize).
     */
    reInitialize(): Promise<ApiTypes.DbReInitResult>;
    /**
     * Delete all media files (assets, presentations) from the database.
     */
    flushMediaFiles(): Promise<FlushMediaResult>;
    get assets(): mongodb.Collection<any>;
    get presentations(): mongodb.Collection<any>;
    get updates(): mongodb.Collection<any>;
    get folderTitleTree(): mongodb.Collection<any>;
    get seatingPlan(): mongodb.Collection<any>;
    listUpdateTasks(): Promise<ApiTypes.MediaUpdateTask[]>;
    getFolderTitleTree(): Promise<TitlesTypes.TreeTitleList>;
    /**
     * @param scheme - Has to be `ref` or `uuid`
     * @param authority - The part after the colon: For example
     * `Marmotte` `d2377ef9-1fa6-4ae9-8f9a-7d23942b319e`
     */
    getPresentation(scheme: 'ref' | 'uuid', authority: string): Promise<any>;
    /**
     * @param scheme - Has to be `ref` or `uuid`
     * @param authority - The part after the colon: For example
     * `PR_Beethoven_Ludwig-van` `d2377ef9-1fa6-4ae9-8f9a-7d23942b319e`
     */
    getAsset(scheme: 'ref' | 'uuid', authority: string): Promise<any>;
    searchPresentationBySubstring(substring: string): Promise<ApiTypes.DynamikSelectResult[]>;
    getDocumentCounts(): Promise<ApiTypes.MediaCount>;
    getAllAssetRefs(): Promise<string[]>;
    getAllAssetUuids(): Promise<string[]>;
    getAllAssetUris(): Promise<string[]>;
}
export {};
