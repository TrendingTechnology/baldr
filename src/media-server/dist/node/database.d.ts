/**
 * @module @bldr/media-server/database
 */
import mongodb from 'mongodb';
/**
 * A wrapper around MongoDB.
 */
export declare class Database {
    schema: object;
    private mongoClient;
    db: mongodb.Db;
    constructor();
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
     * Drop all collections except collection which defined drop: false in
     * this.schema
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
    flushMediaFiles(): Promise<{
        [key: string]: any;
    }>;
    get assets(): mongodb.Collection<any>;
    get presentations(): mongodb.Collection<any>;
    get updates(): mongodb.Collection<any>;
    get folderTitleTree(): mongodb.Collection<any>;
    get seatingPlan(): mongodb.Collection<any>;
}
