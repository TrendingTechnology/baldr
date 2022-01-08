import { readFile, writeFile } from './txt';
/**
 * Read a JSON file and parse it.
 *
 * @param filePath - A path of a JSON file.
 *
 * @returns The parsed JSON object.
 */
export function readJsonFile(filePath) {
    return JSON.parse(readFile(filePath));
}
/**
 * Convert a value into a JSON string and write it into a file.
 *
 * @param filePath - A path of destination JSON file.
 * @param value - A value to convert to JSON
 *
 * @returns The stringifed JSON content that was writen to the text file.
 */
export function writeJsonFile(filePath, value) {
    return writeFile(filePath, JSON.stringify(value, null, 2));
}
