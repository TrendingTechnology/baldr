import mongodb from 'mongodb';
import { getConfig } from '@bldr/config';
const config = getConfig();
export class MongoDbClient {
    client;
    database;
    constructor() {
        const conf = config.databases.mongodb;
        const user = encodeURIComponent(conf.user);
        const password = encodeURIComponent(conf.password);
        const authMechanism = 'DEFAULT';
        const url = `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`;
        this.client = new mongodb.MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    /**
     * Connect to the MongoDB database as a client, create a database wrapper object and
     * initialize the database.
     */
    async connect() {
        if (!this.client.isConnected()) {
            await this.client.connect();
        }
        if (this.database == null) {
            this.database = new Database(this.client.db(config.databases.mongodb.dbName));
            await this.database.initialize();
        }
        return this.database;
    }
    async close() {
        await this.client.close();
    }
}
/**
 * Connect to the MongoDB server.
 */
export async function connectDb() {
    const conf = config.databases.mongodb;
    const user = encodeURIComponent(conf.user);
    const password = encodeURIComponent(conf.password);
    const authMechanism = 'DEFAULT';
    const url = `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`;
    const mongoClient = new mongodb.MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    await mongoClient.connect();
    mongoClient.db(config.databases.mongodb.dbName);
    return mongoClient;
}
/**
 * Connect and initialize the MongoDB database.
 */
export async function getDatabaseWrapper() {
    const mongoClient = await connectDb();
    const database = new Database(mongoClient.db());
    await database.initialize();
    return database;
}
/**
 * A wrapper around MongoDB.
 */
export class Database {
    schema;
    db;
    isInitialized = false;
    constructor(db) {
        this.db = db;
        this.schema = {
            assets: {
                indexes: [
                    { field: 'path', unique: true },
                    { field: 'ref', unique: true },
                    { field: 'uuid', unique: true }
                ],
                drop: true
            },
            presentations: {
                indexes: [
                    { field: 'meta.ref', unique: true },
                    {
                        field: 'meta.uuid',
                        unique: true,
                        partialFilterExpression: { 'meta.uuid': { $type: 'string' } }
                    }
                ],
                drop: true
            },
            updates: {
                indexes: [{ field: 'begin', unique: false }],
                drop: true
            },
            folderTitleTree: {
                indexes: [{ field: 'ref', unique: true }],
                drop: true
            },
            seatingPlan: {
                indexes: [{ field: 'timeStampMsec', unique: true }],
                drop: false
            }
        };
    }
    /**
     * @TODO Remove
     */
    async connect() {
        const mongoClient = await connectDb();
        this.db = mongoClient.db(config.databases.mongodb.dbName);
    }
    /**
     * List all collection names in an array.
     *
     * @returns An array of collection names.
     */
    async listCollectionNames() {
        const collections = await this.db.listCollections().toArray();
        const names = [];
        for (const collection of collections) {
            names.push(collection.name);
        }
        return names;
    }
    /**
     * Create the collections with indexes.
     */
    async initialize() {
        if (!this.isInitialized) {
            const collectionNames = await this.listCollectionNames();
            // https://stackoverflow.com/a/35868933
            for (const collectionName in this.schema) {
                if (!collectionNames.includes(collectionName)) {
                    const collection = await this.db.createCollection(collectionName);
                    for (const index of this.schema[collectionName].indexes) {
                        const options = index.partialFilterExpression == null
                            ? { unique: index.unique }
                            : {
                                unique: index.unique,
                                partialFilterExpression: index.partialFilterExpression
                            };
                        await collection.createIndex({ [index.field]: 1 }, options);
                    }
                }
            }
            this.isInitialized = true;
        }
        const result = {};
        for (const collectionName in this.schema) {
            const indexes = await this.db
                .collection(collectionName)
                .listIndexes()
                .toArray();
            const collectionResult = {
                name: collectionName,
                indexes: {}
            };
            result[collectionName] = collectionResult;
            for (const index of indexes) {
                const indexDefinition = index;
                const unique = indexDefinition.unique ? 'true' : 'false';
                result[collectionName].indexes[index.name] = `unique: ${unique}`;
            }
        }
        return result;
    }
    /**
     * Drop all collections except collection which defined `{drop: false}` in
     * `this.schema`
     */
    async drop() {
        const droppedCollections = [];
        for (const collectionName in this.schema) {
            if (this.schema[collectionName].drop) {
                await this.db.dropCollection(collectionName);
                droppedCollections.push(collectionName);
            }
        }
        this.isInitialized = false;
        return {
            droppedCollections
        };
    }
    /**
     * Reinitialize the MongoDB database (Drop all collections and initialize).
     */
    async reInitialize() {
        const resultDrop = await this.drop();
        const resultInit = await this.initialize();
        return {
            resultDrop,
            resultInit
        };
    }
    /**
     * Delete all media files (assets, presentations) from the database.
     */
    async flushMediaFiles() {
        const numberOfDroppedAssets = await this.assets.countDocuments();
        const numberOfDroppedPresentations = await this.presentations.countDocuments();
        await this.assets.deleteMany({});
        await this.presentations.deleteMany({});
        await this.folderTitleTree.deleteMany({});
        return {
            numberOfDroppedAssets,
            numberOfDroppedPresentations
        };
    }
    get assets() {
        return this.db.collection('assets');
    }
    get presentations() {
        return this.db.collection('presentations');
    }
    get updates() {
        return this.db.collection('updates');
    }
    get folderTitleTree() {
        return this.db.collection('folderTitleTree');
    }
    get seatingPlan() {
        return this.db.collection('seatingPlan');
    }
    async listUpdateTasks() {
        return await this.db
            .collection('updates')
            .find({}, { projection: { _id: 0 } })
            .sort({ begin: -1 })
            .limit(20)
            .toArray();
    }
    async getFolderTitleTree() {
        const result = await this.folderTitleTree
            .find({ ref: 'root' }, { projection: { _id: 0 } })
            .next();
        return result.tree;
    }
    /**
     * @param scheme - Has to be `ref` or `uuid`
     * @param authority - The part after the colon: For example
     * `Marmotte` `d2377ef9-1fa6-4ae9-8f9a-7d23942b319e`
     */
    async getPresentation(scheme, authority) {
        const field = `meta.${scheme}`;
        return await this.presentations
            .find({ [field]: authority }, { projection: { _id: 0 } })
            .next();
    }
    /**
     * @param scheme - Has to be `ref` or `uuid`
     * @param authority - The part after the colon: For example
     * `PR_Beethoven_Ludwig-van` `d2377ef9-1fa6-4ae9-8f9a-7d23942b319e`
     */
    async getAsset(scheme, authority) {
        return await this.assets
            .find({ [scheme]: authority }, { projection: { _id: 0 } })
            .next();
    }
    async searchPresentationBySubstring(substring) {
        substring = substring.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const regex = new RegExp(substring, 'gi');
        return await this.presentations
            .aggregate([
            {
                $match: {
                    $or: [
                        {
                            'meta.title': regex
                        },
                        {
                            'meta.subtitle': regex
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: false,
                    ref: '$meta.ref',
                    name: {
                        $cond: {
                            if: '$meta.subtitle',
                            then: { $concat: ['$meta.title', ' - ', '$meta.subtitle'] },
                            else: '$meta.title'
                        }
                    }
                }
            }
        ])
            .toArray();
    }
    async getDocumentCounts() {
        return {
            assets: await this.assets.countDocuments(),
            presentations: await this.presentations.countDocuments()
        };
    }
    async getAllAssetRefs() {
        return await this.assets.distinct('ref');
    }
    async getAllAssetUuids() {
        return await this.assets.distinct('uuid');
    }
    async getAllAssetUris() {
        const refs = await this.getAllAssetRefs();
        const uuids = await this.getAllAssetUuids();
        const uris = [];
        for (const ref of refs) {
            uris.push(`ref:${ref}`);
        }
        for (const uuid of uuids) {
            uris.push(`uuid:${uuid}`);
        }
        return uris;
    }
}
