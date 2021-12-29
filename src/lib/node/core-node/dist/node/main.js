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
exports.copyToTmp = exports.createTmpDir = exports.getTmpDirPath = exports.getBasename = exports.findParentFile = exports.untildify = exports.fetchFile = exports.getPdfPageCount = exports.checkExecutables = exports.gitHead = void 0;
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const git_rev_sync_1 = __importDefault(require("git-rev-sync"));
const node_fetch_1 = __importDefault(require("node-fetch"));
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
        const process = child_process_1.default.spawnSync('which', [executable], {
            shell: true
        });
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
    if (!fs_1.default.existsSync(filePath)) {
        throw new Error(`PDF file doesn’t exist: ${filePath}.`);
    }
    const proc = child_process_1.default.spawnSync('pdfinfo', [filePath], {
        encoding: 'utf-8',
        cwd: process.cwd()
    });
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
        const response = yield (0, node_fetch_1.default)(new url_1.URL(url));
        fs_1.default.mkdirSync(path_1.default.dirname(dest), { recursive: true });
        fs_1.default.writeFileSync(dest, Buffer.from(yield response.arrayBuffer()));
    });
}
exports.fetchFile = fetchFile;
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
/**
 * Find a specific file by file name in a parent folder structure
 *
 * @param filePath - A file path to search for a file in one of the parent
 *   folder struture.
 * @param fileName - The name of the searched file.
 *
 * @returns The path of the found parent file or undefined if not found.
 */
function findParentFile(filePath, fileName) {
    let parentDir;
    if (fs_1.default.existsSync(filePath) && fs_1.default.lstatSync(filePath).isDirectory()) {
        parentDir = filePath;
    }
    else {
        parentDir = path_1.default.dirname(filePath);
    }
    const segments = parentDir.split(path_1.default.sep);
    for (let index = segments.length; index >= 0; index--) {
        const pathSegments = segments.slice(0, index);
        const parentFile = [...pathSegments, fileName].join(path_1.default.sep);
        if (fs_1.default.existsSync(parentFile)) {
            return parentFile;
        }
    }
}
exports.findParentFile = findParentFile;
/**
 * Extract the base name without the extension from a file path.
 *
 * @param filePath A file path.
 *
 * @returns The base name without the extension.
 */
function getBasename(filePath) {
    return path_1.default.basename(filePath, path_1.default.extname(filePath));
}
exports.getBasename = getBasename;
/**
 * Create a path like `/tmp/baldr-`. The path does not exist yet. It has
 * to be created.
 *
 * @returns A file path in the temporary OS directory containing `baldr`.
 */
function getTmpDirPath() {
    return path_1.default.join(os_1.default.tmpdir(), path_1.default.sep, 'baldr-');
}
exports.getTmpDirPath = getTmpDirPath;
/**
 * Create a temporary directory.
 *
 * @returns The path of the created temporary directory.
 */
function createTmpDir() {
    return fs_1.default.mkdtempSync(getTmpDirPath());
}
exports.createTmpDir = createTmpDir;
/**
 * Copy a file to the temporary directory of the operation system.
 *
 * @param pathSegments - Path segments for `path.join()`.
 *
 * @returns The destination path in the temporary directory of the OS.
 */
function copyToTmp(...pathSegments) {
    const src = path_1.default.join(...pathSegments);
    const tmpDir = createTmpDir();
    const basename = path_1.default.basename(src);
    const dest = path_1.default.join(tmpDir, basename);
    fs_1.default.copyFileSync(src, dest);
    return dest;
}
exports.copyToTmp = copyToTmp;
