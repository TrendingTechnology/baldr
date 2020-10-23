"use strict";
/**
 * Low level classes and functions used by the node packages. Some helper
 * functions etc.
 *
 * @module @bldr/core-node
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdfPageCount = exports.checkExecutables = exports.gitHead = exports.log = void 0;
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
// Third party packages
const git_rev_sync_1 = __importDefault(require("git-rev-sync"));
/**
 * Wrapper around `util.format()` and `console.log()`
 */
function log(format) {
    const args = Array.from(arguments).slice(1);
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
    if (match) {
        return parseInt(match[1]);
    }
    return 0;
}
exports.getPdfPageCount = getPdfPageCount;
exports.default = {
    checkExecutables,
    getPdfPageCount,
    gitHead,
    log
};
