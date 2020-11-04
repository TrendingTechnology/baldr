"use strict";
/**
 * @module @bldr/media-server/database
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.connectDb = void 0;
const mongodb_1 = __importDefault(require("mongodb"));
const config_1 = __importDefault(require("@bldr/config"));
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const conf = config_1.default.databases.mongodb;
        const user = encodeURIComponent(conf.user);
        const password = encodeURIComponent(conf.password);
        const authMechanism = 'DEFAULT';
        const url = `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`;
        const mongoClient = new mongodb_1.default.MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        yield mongoClient.connect();
        return mongoClient.db(config_1.default.databases.mongodb.dbName);
    });
}
exports.connectDb = connectDb;
/**
 * A wrapper around MongoDB.
 */
class Database {
    constructor(db) {
        this.db = db;
        /**
         * @type {Object}
         */
        this.schema = {
            assets: {
                indexes: [
                    { field: 'path', unique: true },
                    { field: 'id', unique: true },
                    { field: 'uuid', unique: true }
                ],
                drop: true
            },
            presentations: {
                indexes: [
                    { field: 'id', unique: true }
                ],
                drop: true
            },
            updates: {
                indexes: [
                    { field: 'begin', unique: false }
                ],
                drop: true
            },
            folderTitleTree: {
                indexes: [
                    { field: 'id', unique: true },
                ],
                drop: true
            },
            seatingPlan: {
                indexes: [
                    { timeStampMsec: 'path', unique: true }
                ],
                drop: false
            }
        };
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db = yield connectDb();
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
            const collectionNames = yield this.listCollectionNames();
            // https://stackoverflow.com/a/35868933
            for (const collectionName in this.schema) {
                if (!collectionNames.includes(collectionName)) {
                    const collection = yield this.db.createCollection(collectionName);
                    for (const index of this.schema[collectionName].indexes) {
                        yield collection.createIndex({ [index.field]: 1 }, { unique: index.unique });
                    }
                }
            }
            const result = {};
            for (const collectionName in this.schema) {
                const indexes = yield this.db.collection(collectionName).listIndexes().toArray();
                result[collectionName] = {
                    name: collectionName,
                    indexes: {}
                };
                for (const index of indexes) {
                    const unique = index.unique ? 'true' : 'false';
                    result[collectionName].indexes[index.name] = `unique: ${unique}`;
                }
            }
            return result;
        });
    }
    /**
     * Drop all collections except collection which defined drop: false in
     * this.schema
     */
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            const droppedCollections = [];
            for (const collectionName in this.schema) {
                if (this.schema[collectionName].drop === true) {
                    yield this.db.dropCollection(collectionName);
                    droppedCollections.push(collectionName);
                }
            }
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
            const resultdropDb = yield this.drop();
            const resultInitializeDb = yield this.initialize();
            return {
                resultdropDb,
                resultInitializeDb
            };
        });
    }
    /**
     * Delete all media files (assets, presentations) from the database.
     */
    flushMediaFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const countDroppedAssets = yield this.assets.countDocuments();
            const countDroppedPresentations = yield this.presentations.countDocuments();
            yield this.assets.deleteMany({});
            yield this.presentations.deleteMany({});
            yield this.folderTitleTree.deleteMany({});
            return {
                countDroppedAssets, countDroppedPresentations
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
}
exports.Database = Database;
