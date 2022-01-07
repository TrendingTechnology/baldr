"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.readFile = void 0;
const fs_1 = __importDefault(require("fs"));
/**
 * Read the content of a text file in the `utf-8` format.
 *
 * A wrapper around `fs.readFileSync()`
 *
 * @param filePath - A path of a text file.
 *
 * @returns The content of the file in the `utf-8` format.
 */
function readFile(filePath) {
    if (!fs_1.default.existsSync(filePath)) {
        throw new Error(`The file “${filePath}” cannot be read because it does not exist.`);
    }
    return fs_1.default.readFileSync(filePath, { encoding: 'utf-8' });
}
exports.readFile = readFile;
/**
 * Write some text content into a file.
 *
 * @param filePath - A path of a text file.
 * @param content - Some text to write to a file.
 */
function writeFile(filePath, content) {
    fs_1.default.writeFileSync(filePath, content);
    return content;
}
exports.writeFile = writeFile;
