var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongodb from 'mongodb';
import { getConfig } from '@bldr/config';
const config = getConfig();
export class MongoDbClient {
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
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client.isConnected()) {
                yield this.client.connect();
            }
            if (this.database == null) {
                this.database = new Database(this.client.db(config.databases.mongodb.dbName));
                yield this.database.initialize();
            }
            return this.database;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
        });
    }
}
/**
 * Connect to the MongoDB server.
 */
export function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const conf = config.databases.mongodb;
        const user = encodeURIComponent(conf.user);
        const password = encodeURIComponent(conf.password);
        const authMechanism = 'DEFAULT';
        const url = `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`;
        const mongoClient = new mongodb.MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        yield mongoClient.connect();
        mongoClient.db(config.databases.mongodb.dbName);
        return mongoClient;
    });
}
/**
 * Connect and initialize the MongoDB database.
 */
export function getDatabaseWrapper() {
    return __awaiter(this, void 0, void 0, function* () {
        const mongoClient = yield connectDb();
        const database = new Database(mongoClient.db());
        yield database.initialize();
        return database;
    });
}
/**
 * A wrapper around MongoDB.
 */
export class Database {
    constructor(db) {
        this.isInitialized = false;
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
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoClient = yield connectDb();
            this.db = mongoClient.db(config.databases.mongodb.dbName);
        });
    }
    /**
     * List all collection names in an array.
     *
     * @returns An array of collection names.
     */
    listCollectionNames() {
        return __awaiter(this, void 0, void 0, function* () {
            const collections = yield this.db.listCollections().toArray();
            const names = [];
            for (const collection of collections) {
                names.push(collection.name);
            }
            return names;
        });
    }
    /**
     * Create the collections with indexes.
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isInitialized) {
                const collectionNames = yield this.listCollectionNames();
                // https://stackoverflow.com/a/35868933
                for (const collectionName in this.schema) {
                    if (!collectionNames.includes(collectionName)) {
                        const collection = yield this.db.createCollection(collectionName);
                        for (const index of this.schema[collectionName].indexes) {
                            const options = index.partialFilterExpression == null
                                ? { unique: index.unique }
                                : {
                                    unique: index.unique,
                                    partialFilterExpression: index.partialFilterExpression
                                };
                            yield collection.createIndex({ [index.field]: 1 }, options);
                        }
                    }
                }
                this.isInitialized = true;
            }
            const result = {};
            for (const collectionName in this.schema) {
                const indexes = yield this.db
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
        });
    }
    /**
     * Drop all collections except collection which defined `{drop: false}` in
     * `this.schema`
     */
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            const droppedCollections = [];
            for (const collectionName in this.schema) {
                if (this.schema[collectionName].drop) {
                    yield this.db.dropCollection(collectionName);
                    droppedCollections.push(collectionName);
                }
            }
            this.isInitialized = false;
            return {
                droppedCollections
            };
        });
    }
    /**
     * Reinitialize the MongoDB database (Drop all collections and initialize).
     */
    reInitialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const resultDrop = yield this.drop();
            const resultInit = yield this.initialize();
            return {
                resultDrop,
                resultInit
            };
        });
    }
    /**
     * Delete all media files (assets, presentations) from the database.
     */
    flushMediaFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const numberOfDroppedAssets = yield this.assets.countDocuments();
            const numberOfDroppedPresentations = yield this.presentations.countDocuments();
            yield this.assets.deleteMany({});
            yield this.presentations.deleteMany({});
            yield this.folderTitleTree.deleteMany({});
            return {
                numberOfDroppedAssets,
                numberOfDroppedPresentations
            };
        });
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
    listUpdateTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .collection('updates')
                .find({}, { projection: { _id: 0 } })
                .sort({ begin: -1 })
                .limit(20)
                .toArray();
        });
    }
    getFolderTitleTree() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.folderTitleTree
                .find({ ref: 'root' }, { projection: { _id: 0 } })
                .next();
            return result.tree;
        });
    }
    /**
     * @param scheme - Has to be `ref` or `uuid`
     * @param authority - The part after the colon: For example
     * `Marmotte` `d2377ef9-1fa6-4ae9-8f9a-7d23942b319e`
     */
    getPresentation(scheme, authority) {
        return __awaiter(this, void 0, void 0, function* () {
            const field = `meta.${scheme}`;
            return yield this.presentations
                .find({ [field]: authority }, { projection: { _id: 0 } })
                .next();
        });
    }
    /**
     * @param scheme - Has to be `ref` or `uuid`
     * @param authority - The part after the colon: For example
     * `PR_Beethoven_Ludwig-van` `d2377ef9-1fa6-4ae9-8f9a-7d23942b319e`
     */
    getAsset(scheme, authority) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.assets
                .find({ [scheme]: authority }, { projection: { _id: 0 } })
                .next();
        });
    }
    searchPresentationBySubstring(substring) {
        return __awaiter(this, void 0, void 0, function* () {
            substring = substring.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            const regex = new RegExp(substring, 'gi');
            return yield this.presentations
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
        });
    }
    getDocumentCounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                assets: yield this.assets.countDocuments(),
                presentations: yield this.presentations.countDocuments()
            };
        });
    }
    getAllAssetRefs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.assets.distinct('ref');
        });
    }
    getAllAssetUuids() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.assets.distinct('uuid');
        });
    }
    getAllAssetUris() {
        return __awaiter(this, void 0, void 0, function* () {
            const refs = yield this.getAllAssetRefs();
            const uuids = yield this.getAllAssetUuids();
            const uris = [];
            for (const ref of refs) {
                uris.push(`ref:${ref}`);
            }
            for (const uuid of uuids) {
                uris.push(`uuid:${uuid}`);
            }
            return uris;
        });
    }
}
