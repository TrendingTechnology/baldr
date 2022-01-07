"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJsonFile = exports.readJsonFile = void 0;
const txt_1 = require("./txt");
/**
 * Read a JSON file and parse it.
 *
 * @param filePath - A path of a JSON file.
 *
 * @returns The parsed JSON object.
 */
function readJsonFile(filePath) {
    return JSON.parse((0, txt_1.readFile)(filePath));
}
exports.readJsonFile = readJsonFile;
/**
 * Convert a value into a JSON string and write it into a file.
 *
 * @param filePath - A path of destination JSON file.
 * @param value - A value to convert to JSON
 *
 * @returns The stringifed JSON content that was writen to the text file.
 */
function writeJsonFile(filePath, value) {
    return (0, txt_1.writeFile)(filePath, JSON.stringify(value, null, 2));
}
exports.writeJsonFile = writeJsonFile;
