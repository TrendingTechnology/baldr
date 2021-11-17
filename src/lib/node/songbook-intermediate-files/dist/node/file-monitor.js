"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileMonitor = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const config_1 = require("@bldr/config");
const config = config_1.getConfig();
/**
 * Sqlite database wrapper to store file contents hashes to detect
 * file modifications.
 */
class Sqlite {
    /**
     * @param dbFile - The path of the Sqlite database.
     */
    constructor(dbFile) {
        this.dbFile = dbFile;
        /**
         * A instance of the class “Sqlite3”.
         *
         * @type {module:@bldr/songbook-intermediate-files~Sqlite3}
         */
        this.db = new better_sqlite3_1.default(this.dbFile);
        this.db
            .prepare('CREATE TABLE IF NOT EXISTS hashes (filename TEXT UNIQUE, hash TEXT)')
            .run();
        this.db
            .prepare('CREATE INDEX IF NOT EXISTS filename ON hashes(filename)')
            .run();
    }
    /**
     * Insert a hash value of a file.
     *
     * @param filename - Name or path of a file.
     * @param hash - The sha1 hash of the content of the file.
     */
    insert(filename, hash) {
        this.db
            .prepare('INSERT INTO hashes values ($filename, $hash)')
            .run({ filename: filename, hash: hash });
    }
    /**
     * Get the hash value of a file.
     *
     * @param filename - Name or path of a file.
     */
    select(filename) {
        return this.db
            .prepare('SELECT * FROM hashes WHERE filename = $filename')
            .get({ filename: filename });
    }
    /**
     * Update the hash value of a file.
     *
     * @param filename - Name or path of a file.
     * @param hash - The sha1 hash of the content of the file.
     */
    update(filename, hash) {
        this.db
            .prepare('UPDATE hashes SET hash = $hash WHERE filename = $filename')
            .run({ filename: filename, hash: hash });
    }
    /**
     * Delete all rows from the table “hashes”.
     */
    flush() {
        this.db.prepare('DELETE FROM hashes').run();
    }
}
/**
 * Monitor files changes
 */
class FileMonitor {
    /**
     * @param dbFile - The path where to store the Sqlite database.
     */
    constructor(dbFile) {
        this.db = new Sqlite(dbFile);
    }
    /**
     * Build the sha1 hash of a file.
     *
     * @param filename - The path of the file.
     */
    hashSHA1(filename) {
        return crypto
            .createHash('sha1')
            .update(fs.readFileSync(filename))
            .digest('hex');
    }
    /**
     * Check for file modifications
     *
     * @param filename - Path to the file.
     */
    isModified(filename) {
        filename = path.resolve(filename);
        if (!fs.existsSync(filename)) {
            return false;
        }
        const hash = this.hashSHA1(filename);
        const row = this.db.select(filename);
        let hashStored = '';
        if (row !== undefined) {
            hashStored = row.hash;
        }
        else {
            this.db.insert(filename, hash);
        }
        if (hash !== hashStored) {
            this.db.update(filename, hash);
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Flush the file monitor database.
     */
    flush() {
        this.db.flush();
    }
    /**
     * Purge the file monitor database by deleting it.
     */
    purge() {
        if (fs.existsSync(this.db.dbFile))
            fs.unlinkSync(this.db.dbFile);
    }
}
exports.fileMonitor = new FileMonitor(path.join(config.songbook.path, 'filehashes.db'));
