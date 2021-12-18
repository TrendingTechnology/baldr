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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.getDatabaseWrapper = exports.connectDb = exports.MongoDbClient = void 0;
var mongodb_1 = __importDefault(require("mongodb"));
var config_1 = require("@bldr/config");
var config = (0, config_1.getConfig)();
var MongoDbClient = /** @class */ (function () {
    function MongoDbClient() {
        var conf = config.databases.mongodb;
        var user = encodeURIComponent(conf.user);
        var password = encodeURIComponent(conf.password);
        var authMechanism = 'DEFAULT';
        var url = "mongodb://".concat(user, ":").concat(password, "@").concat(conf.url, "/").concat(conf.dbName, "?authMechanism=").concat(authMechanism);
        this.client = new mongodb_1.default.MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    /**
     * Connect to the MongoDB database as a client, create a database wrapper object and
     * initialize the database.
     */
    MongoDbClient.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.client.isConnected()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this.database == null)) return [3 /*break*/, 4];
                        this.database = new Database(this.client.db(config.databases.mongodb.dbName));
                        return [4 /*yield*/, this.database.initialize()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, this.database];
                }
            });
        });
    };
    MongoDbClient.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MongoDbClient;
}());
exports.MongoDbClient = MongoDbClient;
/**
 * Connect to the MongoDB server.
 */
function connectDb() {
    return __awaiter(this, void 0, void 0, function () {
        var conf, user, password, authMechanism, url, mongoClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conf = config.databases.mongodb;
                    user = encodeURIComponent(conf.user);
                    password = encodeURIComponent(conf.password);
                    authMechanism = 'DEFAULT';
                    url = "mongodb://".concat(user, ":").concat(password, "@").concat(conf.url, "/").concat(conf.dbName, "?authMechanism=").concat(authMechanism);
                    mongoClient = new mongodb_1.default.MongoClient(url, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    });
                    return [4 /*yield*/, mongoClient.connect()];
                case 1:
                    _a.sent();
                    mongoClient.db(config.databases.mongodb.dbName);
                    return [2 /*return*/, mongoClient];
            }
        });
    });
}
exports.connectDb = connectDb;
/**
 * Connect and initialize the MongoDB database.
 */
function getDatabaseWrapper() {
    return __awaiter(this, void 0, void 0, function () {
        var mongoClient, database;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectDb()];
                case 1:
                    mongoClient = _a.sent();
                    database = new Database(mongoClient.db());
                    return [4 /*yield*/, database.initialize()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, database];
            }
        });
    });
}
exports.getDatabaseWrapper = getDatabaseWrapper;
/**
 * A wrapper around MongoDB.
 */
var Database = /** @class */ (function () {
    function Database(db) {
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
                indexes: [{ field: 'meta.ref', unique: true }],
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
    Database.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mongoClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connectDb()];
                    case 1:
                        mongoClient = _a.sent();
                        this.db = mongoClient.db(config.databases.mongodb.dbName);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * List all collection names in an array.
     *
     * @returns An array of collection names.
     */
    Database.prototype.listCollectionNames = function () {
        return __awaiter(this, void 0, void 0, function () {
            var collections, names, _i, collections_1, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.listCollections().toArray()];
                    case 1:
                        collections = _a.sent();
                        names = [];
                        for (_i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
                            collection = collections_1[_i];
                            names.push(collection.name);
                        }
                        return [2 /*return*/, names];
                }
            });
        });
    };
    /**
     * Create the collections with indexes.
     */
    Database.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var collectionNames, _a, _b, _i, collectionName, collection, _c, _d, index, result, _e, _f, _g, collectionName, indexes, _h, indexes_1, index, indexDefinition, unique;
            var _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        if (!!this.isInitialized) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.listCollectionNames()
                            // https://stackoverflow.com/a/35868933
                        ];
                    case 1:
                        collectionNames = _k.sent();
                        _a = [];
                        for (_b in this.schema)
                            _a.push(_b);
                        _i = 0;
                        _k.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        collectionName = _a[_i];
                        if (!!collectionNames.includes(collectionName)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.db.createCollection(collectionName)];
                    case 3:
                        collection = _k.sent();
                        _c = 0, _d = this.schema[collectionName].indexes;
                        _k.label = 4;
                    case 4:
                        if (!(_c < _d.length)) return [3 /*break*/, 7];
                        index = _d[_c];
                        return [4 /*yield*/, collection.createIndex((_j = {}, _j[index.field] = 1, _j), { unique: index.unique })];
                    case 5:
                        _k.sent();
                        _k.label = 6;
                    case 6:
                        _c++;
                        return [3 /*break*/, 4];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8:
                        this.isInitialized = true;
                        _k.label = 9;
                    case 9:
                        result = {};
                        _e = [];
                        for (_f in this.schema)
                            _e.push(_f);
                        _g = 0;
                        _k.label = 10;
                    case 10:
                        if (!(_g < _e.length)) return [3 /*break*/, 13];
                        collectionName = _e[_g];
                        return [4 /*yield*/, this.db
                                .collection(collectionName)
                                .listIndexes()
                                .toArray()];
                    case 11:
                        indexes = _k.sent();
                        result[collectionName] = {
                            name: collectionName,
                            indexes: {}
                        };
                        for (_h = 0, indexes_1 = indexes; _h < indexes_1.length; _h++) {
                            index = indexes_1[_h];
                            indexDefinition = index;
                            unique = indexDefinition.unique ? 'true' : 'false';
                            result[collectionName].indexes[index.name] = "unique: ".concat(unique);
                        }
                        _k.label = 12;
                    case 12:
                        _g++;
                        return [3 /*break*/, 10];
                    case 13: return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Drop all collections except collection which defined `{drop: false}` in
     * `this.schema`
     */
    Database.prototype.drop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var droppedCollections, _a, _b, _i, collectionName;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        droppedCollections = [];
                        _a = [];
                        for (_b in this.schema)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        collectionName = _a[_i];
                        if (!this.schema[collectionName].drop) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.dropCollection(collectionName)];
                    case 2:
                        _c.sent();
                        droppedCollections.push(collectionName);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.isInitialized = false;
                        return [2 /*return*/, {
                                droppedCollections: droppedCollections
                            }];
                }
            });
        });
    };
    /**
     * Reinitialize the MongoDB database (Drop all collections and initialize).
     */
    Database.prototype.reInitialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resultdropDb, resultInitializeDb;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.drop()];
                    case 1:
                        resultdropDb = _a.sent();
                        return [4 /*yield*/, this.initialize()];
                    case 2:
                        resultInitializeDb = _a.sent();
                        return [2 /*return*/, {
                                resultdropDb: resultdropDb,
                                resultInitializeDb: resultInitializeDb
                            }];
                }
            });
        });
    };
    /**
     * Delete all media files (assets, presentations) from the database.
     */
    Database.prototype.flushMediaFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var countDroppedAssets, countDroppedPresentations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.assets.countDocuments()];
                    case 1:
                        countDroppedAssets = _a.sent();
                        return [4 /*yield*/, this.presentations.countDocuments()];
                    case 2:
                        countDroppedPresentations = _a.sent();
                        return [4 /*yield*/, this.assets.deleteMany({})];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.presentations.deleteMany({})];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.folderTitleTree.deleteMany({})];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, {
                                countDroppedAssets: countDroppedAssets,
                                countDroppedPresentations: countDroppedPresentations
                            }];
                }
            });
        });
    };
    Object.defineProperty(Database.prototype, "assets", {
        get: function () {
            return this.db.collection('assets');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Database.prototype, "presentations", {
        get: function () {
            return this.db.collection('presentations');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Database.prototype, "updates", {
        get: function () {
            return this.db.collection('updates');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Database.prototype, "folderTitleTree", {
        get: function () {
            return this.db.collection('folderTitleTree');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Database.prototype, "seatingPlan", {
        get: function () {
            return this.db.collection('seatingPlan');
        },
        enumerable: false,
        configurable: true
    });
    Database.prototype.listUpdateTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .collection('updates')
                            .find({}, { projection: { _id: 0 } })
                            .sort({ begin: -1 })
                            .limit(20)
                            .toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Database.prototype.getFolderTitleTree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.folderTitleTree
                            .find({ ref: 'root' }, { projection: { _id: 0 } })
                            .next()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.tree];
                }
            });
        });
    };
    Database.prototype.getPresentationByRef = function (ref) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.presentations
                        .find({ 'meta.ref': ref }, { projection: { _id: 0 } })
                        .next()];
            });
        });
    };
    Database.prototype.getDocumentCounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, this.assets.countDocuments()];
                    case 1:
                        _a.assets = _b.sent();
                        return [4 /*yield*/, this.presentations.countDocuments()];
                    case 2: return [2 /*return*/, (_a.presentations = _b.sent(),
                            _a)];
                }
            });
        });
    };
    Database.prototype.getAllAssetRefs = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.assets.distinct('ref')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Database.prototype.getAllAssetUuids = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.assets.distinct('uuid')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Database.prototype.getAllAssetUris = function () {
        return __awaiter(this, void 0, void 0, function () {
            var refs, uuids, uris, _i, refs_1, ref, _a, uuids_1, uuid;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getAllAssetRefs()];
                    case 1:
                        refs = _b.sent();
                        return [4 /*yield*/, this.getAllAssetUuids()];
                    case 2:
                        uuids = _b.sent();
                        uris = [];
                        for (_i = 0, refs_1 = refs; _i < refs_1.length; _i++) {
                            ref = refs_1[_i];
                            uris.push("ref:".concat(ref));
                        }
                        for (_a = 0, uuids_1 = uuids; _a < uuids_1.length; _a++) {
                            uuid = uuids_1[_a];
                            uris.push("uuid:".concat(uuid));
                        }
                        return [2 /*return*/, uris];
                }
            });
        });
    };
    return Database;
}());
exports.Database = Database;
