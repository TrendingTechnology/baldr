import mongodb from 'mongodb';
import { ApiTypes, TitlesTypes } from '@bldr/type-definitions';
interface ClientWrapper {
    connect: () => Promise<DatabaseWrapper>;
    close: () => Promise<void>;
}
interface DatabaseWrapper {
    initialize: () => Promise<any>;
    getDocumentCounts: () => Promise<ApiTypes.Count>;
    getFolderTitleTree: () => Promise<TitlesTypes.TreeTitleList>;
    listUpdateTasks: () => Promise<ApiTypes.Task[]>;
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
interface DynamikSelectResult {
    ref: string;
    name: string;
}
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
    initialize(): Promise<{
        [key: string]: any;
    }>;
    /**
     * Drop all collections except collection which defined `{drop: false}` in
     * `this.schema`
     */
    drop(): Promise<{
        [key: string]: any;
    }>;
    /**
     * Reinitialize the MongoDB database (Drop all collections and initialize).
     */
    reInitialize(): Promise<{
        [key: string]: any;
    }>;
    /**
     * Delete all media files (assets, presentations) from the database.
     */
    flushMediaFiles(): Promise<FlushMediaResult>;
    get assets(): mongodb.Collection<any>;
    get presentations(): mongodb.Collection<any>;
    get updates(): mongodb.Collection<any>;
    get folderTitleTree(): mongodb.Collection<any>;
    get seatingPlan(): mongodb.Collection<any>;
    listUpdateTasks(): Promise<ApiTypes.Task[]>;
    getFolderTitleTree(): Promise<TitlesTypes.TreeTitleList>;
    getPresentationByRef(ref: string): Promise<any>;
    getAsset(scheme: 'ref' | 'uuid', uri: string): Promise<any>;
    searchPresentationBySubstring(substring: string): Promise<DynamikSelectResult[]>;
    getDocumentCounts(): Promise<ApiTypes.Count>;
    private getAllAssetRefs;
    private getAllAssetUuids;
    getAllAssetUris(): Promise<string[]>;
}
export {};
