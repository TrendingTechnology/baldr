/**
 * Walk through a tree of files and directories.
 *
 * @module @bldr/media-manager/directory-tree-walk
 */
import fs from 'fs';
import path from 'path';
import * as media from './media-file-classes';
async function callWalkFunctionBundle(bundle, filePath, payload) {
    if (bundle.everyFile != null) {
        await bundle.everyFile(filePath, payload);
    }
    const isPresentation = media.isPresentation(filePath);
    const isAsset = media.isAsset(filePath);
    const isTex = media.isTex(filePath);
    if ((isPresentation || isAsset || isTex) && bundle.all != null) {
        await bundle.all(filePath, payload);
    }
    if (isPresentation && bundle.presentation != null) {
        await bundle.presentation(filePath, payload);
    }
    else if (isAsset && bundle.asset != null) {
        await bundle.asset(filePath, payload);
    }
    else if (isTex && bundle.tex != null) {
        await bundle.tex(filePath, payload);
    }
}
function normalizeOptions(raw) {
    const normalized = {};
    // If regex is a string it is treated as an extension.
    let extension;
    if (typeof raw?.regex === 'string' && raw.extension != null) {
        throw new Error('The options “extension” and “regex” are mutually exclusive.');
    }
    if (typeof raw?.regex === 'string') {
        extension = raw.regex;
    }
    else if (raw?.extension != null) {
        extension = raw.extension;
    }
    if (extension != null) {
        normalized.regex = new RegExp('.*.' + extension + '$', 'i'); // eslint-disable-line
    }
    if (raw?.regex != null && typeof raw.regex !== 'string') {
        normalized.regex = raw.regex;
    }
    normalized.maxDepths = raw?.maxDepths;
    if (raw?.payload != null) {
        normalized.payload = raw.payload;
    }
    return normalized;
}
async function walkRecursively(walkFunction, filePaths, opt, depths = 0) {
    if (opt.maxDepths != null && opt.maxDepths + 1 < depths) {
        return;
    }
    // A list of file paths.
    if (Array.isArray(filePaths)) {
        for (const filePath of filePaths) {
            await walkRecursively(walkFunction, filePath, opt);
        }
        return;
    }
    const filePath = filePaths;
    // Rename action: Rename during walk, filePath can change
    if (!fs.existsSync(filePath)) {
        return;
    }
    // A directory.
    if (fs.statSync(filePath).isDirectory()) {
        const directoryPath = filePath;
        if (typeof walkFunction !== 'function' && walkFunction.directory != null) {
            await walkFunction.directory(directoryPath, opt.payload);
        }
        if (fs.existsSync(directoryPath)) {
            const files = fs.readdirSync(directoryPath);
            depths++;
            for (const fileName of files) {
                // Exclude hidden files and directories like '.git'
                if (fileName.charAt(0) !== '.') {
                    await walkRecursively(walkFunction, path.join(directoryPath, fileName), opt, depths);
                }
            }
        }
        // A single file.
    }
    else {
        // Exclude hidden files and directories like '.git'
        if (path.basename(filePath).charAt(0) === '.') {
            return;
        }
        if (!fs.existsSync(filePath)) {
            return;
        }
        if (opt.regex != null) {
            if (filePath.match(opt.regex) == null) {
                return;
            }
        }
        if (typeof walkFunction === 'function') {
            await walkFunction(filePath, opt.payload);
            return;
        }
        await callWalkFunctionBundle(walkFunction, filePath, opt.payload);
    }
}
/**
 * Execute a function on one file or walk trough all files matching a
 * regex in the current working directory or in the given directory
 * path.
 *
 * @param walkFunction - A single function or an object containing functions.
 */
export async function walk(walkFunction, opt) {
    if (typeof walkFunction === 'object' && opt?.regex != null) {
        throw new Error('Use a single function and a regex or an object containing functions without a regex.');
    }
    let filePaths;
    // commander [filepath...] -> without arguments is an empty array.
    if (opt?.path == null ||
        (Array.isArray(opt?.path) && opt?.path.length === 0)) {
        filePaths = process.cwd();
    }
    else {
        filePaths = opt.path;
    }
    await walkRecursively(walkFunction, filePaths, normalizeOptions(opt));
}
