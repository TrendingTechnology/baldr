"use strict";
/**
 * Low level functions used by the node packages. Some helper
 * functions etc.
 *
 * @module @bldr/core-node
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
exports.untildify = exports.writeJsonFile = exports.readJsonFile = exports.writeFile = exports.readFile = exports.fetchFile = exports.getPdfPageCount = exports.checkExecutables = exports.gitHead = exports.log = void 0;
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
// Third party packages.
const git_rev_sync_1 = __importDefault(require("git-rev-sync"));
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * A wrapper function around the functions `util.format()` and `console.log()`.
 *
 * ```js
 * util.format('%s:%s', 'foo', 'bar');
 * ```
 */
function log(format, ...args) {
    console.log(util_1.default.format(format, ...args));
}
exports.log = log;
/**
 * Generate a revision string in the form version-gitshort(-dirty)
 */
function gitHead() {
    return {
        short: git_rev_sync_1.default.short(),
        long: git_rev_sync_1.default.long(),
        isDirty: git_rev_sync_1.default.isDirty()
    };
}
exports.gitHead = gitHead;
/**
 * Check if some executables are installed. Throws an error if not.
 *
 * @param executables - An array of executables names or a
 *   a single executable as a string.
 */
function checkExecutables(executables) {
    if (!Array.isArray(executables))
        executables = [executables];
    for (const executable of executables) {
        const process = child_process_1.default.spawnSync('which', [executable], { shell: true });
        if (process.status !== 0) {
            throw new Error(`Executable is not available: ${executable}`);
        }
    }
}
exports.checkExecutables = checkExecutables;
/**
 * Get the page count of an PDF file. You have to install the command
 * line utility `pdfinfo` from the Poppler PDF suite.
 *
 * @see {@link https://poppler.freedesktop.org}
 *
 * @param filePath - The path on an PDF file.
 */
function getPdfPageCount(filePath) {
    checkExecutables('pdfinfo');
    if (!fs_1.default.existsSync(filePath))
        throw new Error(`PDF file doesn’t exist: ${filePath}.`);
    const proc = child_process_1.default.spawnSync('pdfinfo', [filePath], { encoding: 'utf-8', cwd: process.cwd() });
    const match = proc.stdout.match(/Pages:\s+(\d+)/);
    if (match != null) {
        return parseInt(match[1]);
    }
    return 0;
}
exports.getPdfPageCount = getPdfPageCount;
/**
 * Download a URL to a destination.
 *
 * @param url - The URL.
 * @param dest - The destination. Missing parent directories are
 *   automatically created.
 */
function fetchFile(url, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield node_fetch_1.default(new url_1.URL(url));
        fs_1.default.mkdirSync(path_1.default.dirname(dest), { recursive: true });
        fs_1.default.writeFileSync(dest, Buffer.from(yield response.arrayBuffer()));
    });
}
exports.fetchFile = fetchFile;
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
/**
 * Read a JSON file and parse it.
 *
 * @param filePath - A path of a JSON file.
 *
 * @returns The parsed JSON object.
 */
function readJsonFile(filePath) {
    return JSON.parse(readFile(filePath));
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
    return writeFile(filePath, JSON.stringify(value, null, 2));
}
exports.writeJsonFile = writeJsonFile;
/**
 * Replace ~ with the home folder path.
 *
 * @see {@link https://stackoverflow.com/a/36221905/10193818}
 */
function untildify(filePath) {
    if (filePath[0] === '~') {
        return path_1.default.join(os_1.default.homedir(), filePath.slice(1));
    }
    return filePath;
}
exports.untildify = untildify;
