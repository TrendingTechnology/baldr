/**
 * Low level functions used by the node packages. Some helper
 * functions etc.
 *
 * @module @bldr/node-utils
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
import childProcess from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import process from 'process';
import url from 'url';
import { createRequire } from 'module';
import fetch from 'node-fetch';
const require = createRequire(import.meta.url);
/* eslint-disable @typescript-eslint/no-var-requires */
const git = require('git-rev-sync');
/**
 * ```js
 * const __filename = getFilename(import.meta)
 * ```
 */
export function getFilename(meta) {
    return new url.URL('', meta.url).pathname;
}
/**
 * ```js
 * const new URL('.', import.meta.url).pathname = getDirname(import.meta)
 * ```
 */
export function getDirname(meta) {
    return new url.URL('.', meta.url).pathname;
}
function stripExtension(name) {
    const extension = path.extname(name);
    if (extension == null) {
        return name;
    }
    return name.slice(0, -extension.length);
}
/**
 * ```js
 * if (require.main === module) {
 *   // Do something special.
 * }
 * ```
 *
 * https://github.com/tschaub/es-main/blob/main/main.js
 */
export function isModuleMain(meta) {
    const modulePath = url.fileURLToPath(meta.url);
    const scriptPath = process.argv[1];
    const extension = path.extname(scriptPath);
    if (extension != null) {
        return modulePath === scriptPath;
    }
    return stripExtension(modulePath) === scriptPath;
}
/**
 * Generate a revision string in the form version-gitshort(-dirty)
 */
export function getGitHead() {
    return {
        short: git.short(),
        long: git.long(),
        isDirty: git.isDirty()
    };
}
/**
 * Check if some executables are installed. Throws an error if not.
 *
 * @param executables - An array of executables names or a
 *   a single executable as a string.
 */
export function checkExecutables(executables) {
    if (!Array.isArray(executables))
        executables = [executables];
    for (const executable of executables) {
        const process = childProcess.spawnSync('which', [executable], {
            shell: true
        });
        if (process.status !== 0) {
            throw new Error(`Executable is not available: ${executable}`);
        }
    }
}
/**
 * Get the page count of an PDF file. You have to install the command
 * line utility `pdfinfo` from the Poppler PDF suite.
 *
 * @see {@link https://poppler.freedesktop.org}
 *
 * @param filePath - The path on an PDF file.
 */
export function getPdfPageCount(filePath) {
    checkExecutables('pdfinfo');
    if (!fs.existsSync(filePath)) {
        throw new Error(`PDF file doesn’t exist: ${filePath}.`);
    }
    const proc = childProcess.spawnSync('pdfinfo', [filePath], {
        encoding: 'utf-8',
        cwd: process.cwd()
    });
    const match = proc.stdout.match(/Pages:\s+(\d+)/);
    if (match != null) {
        return parseInt(match[1]);
    }
    return 0;
}
/**
 * Download a URL to a destination.
 *
 * @param url - The URL.
 * @param dest - The destination. Missing parent directories are
 *   automatically created.
 */
export function fetchFile(httpUrl, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(new url.URL(httpUrl));
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, Buffer.from(yield response.arrayBuffer()));
    });
}
/**
 * Replace ~ with the home folder path.
 *
 * @see {@link https://stackoverflow.com/a/36221905/10193818}
 */
export function untildify(filePath) {
    if (filePath[0] === '~') {
        return path.join(os.homedir(), filePath.slice(1));
    }
    return filePath;
}
/**
 * Find a specific file by file name in a parent folder structure
 *
 * @param filePath - A file path to search for a file in one of the parent
 *   folder struture.
 * @param fileName - The name of the searched file.
 *
 * @returns The path of the found parent file or undefined if not found.
 */
export function findParentFile(filePath, fileName) {
    let parentDir;
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
        parentDir = filePath;
    }
    else {
        parentDir = path.dirname(filePath);
    }
    const segments = parentDir.split(path.sep);
    for (let index = segments.length; index >= 0; index--) {
        const pathSegments = segments.slice(0, index);
        const parentFile = [...pathSegments, fileName].join(path.sep);
        if (fs.existsSync(parentFile)) {
            return parentFile;
        }
    }
}
/**
 * Extract the base name without the extension from a file path.
 *
 * @param filePath A file path.
 *
 * @returns The base name without the extension.
 */
export function getBasename(filePath) {
    return path.basename(filePath, path.extname(filePath));
}
/**
 * Create a path like `/tmp/baldr-`. The path does not exist yet. It has
 * to be created.
 *
 * @returns A file path in the temporary OS directory containing `baldr`.
 */
export function getTmpDirPath() {
    return path.join(os.tmpdir(), path.sep, 'baldr-');
}
/**
 * Create a temporary directory.
 *
 * @returns The path of the created temporary directory.
 */
export function createTmpDir() {
    return fs.mkdtempSync(getTmpDirPath());
}
/**
 * Copy a file to the temporary directory of the operation system.
 *
 * @param pathSegments - Path segments for `path.join()`.
 *
 * @returns The destination path in the temporary directory of the OS.
 */
export function copyToTmp(...pathSegments) {
    const src = path.join(...pathSegments);
    const tmpDir = createTmpDir();
    const basename = path.basename(src);
    const dest = path.join(tmpDir, basename);
    fs.copyFileSync(src, dest);
    return dest;
}
