import { Database } from 'better-sqlite3';
interface SelectResult {
    hash: string;
}
/**
 * Sqlite database wrapper to store file contents hashes to detect
 * file modifications.
 */
declare class Sqlite {
    /**
     * The path of the Sqlite database.
     */
    dbFile: string;
    /**
     * A instance of the class “Sqlite3”.
     */
    db: Database;
    /**
     * @param dbFile - The path of the Sqlite database.
     */
    constructor(dbFile: string);
    /**
     * Insert a hash value of a file.
     *
     * @param filename - Name or path of a file.
     * @param hash - The sha1 hash of the content of the file.
     */
    insert(filename: string, hash: string): void;
    /**
     * Get the hash value of a file.
     *
     * @param filename - Name or path of a file.
     */
    select(filename: string): SelectResult | undefined;
    /**
     * Update the hash value of a file.
     *
     * @param filename - Name or path of a file.
     * @param hash - The sha1 hash of the content of the file.
     */
    update(filename: string, hash: string): void;
    /**
     * Delete all rows from the table “hashes”.
     */
    flush(): void;
}
/**
 * Monitor files changes
 */
declare class FileMonitor {
    db: Sqlite;
    /**
     * @param dbFile - The path where to store the Sqlite database.
     */
    constructor(dbFile: string);
    /**
     * Build the sha1 hash of a file.
     *
     * @param filename - The path of the file.
     */
    hashSHA1(filename: string): string;
    /**
     * Check for file modifications
     *
     * @param filename - Path to the file.
     */
    isModified(filename: string): boolean;
    /**
     * Flush the file monitor database.
     */
    flush(): void;
    /**
     * Purge the file monitor database by deleting it.
     */
    purge(): void;
}
export declare const fileMonitor: FileMonitor;
export {};
