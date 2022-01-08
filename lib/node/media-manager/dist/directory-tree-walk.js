/**
 * Walk through a tree of files and directories.
 *
 * @module @bldr/media-manager/directory-tree-walk
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
import fs from 'fs';
import path from 'path';
import * as media from './media-file-classes';
function callWalkFunctionBundle(bundle, filePath, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bundle.everyFile != null) {
            yield bundle.everyFile(filePath, payload);
        }
        const isPresentation = media.isPresentation(filePath);
        const isAsset = media.isAsset(filePath);
        const isTex = media.isTex(filePath);
        if ((isPresentation || isAsset || isTex) && bundle.all != null) {
            yield bundle.all(filePath, payload);
        }
        if (isPresentation && bundle.presentation != null) {
            yield bundle.presentation(filePath, payload);
        }
        else if (isAsset && bundle.asset != null) {
            yield bundle.asset(filePath, payload);
        }
        else if (isTex && bundle.tex != null) {
            yield bundle.tex(filePath, payload);
        }
    });
}
function normalizeOptions(raw) {
    const normalized = {};
    // If regex is a string it is treated as an extension.
    let extension;
    if (typeof (raw === null || raw === void 0 ? void 0 : raw.regex) === 'string' && raw.extension != null) {
        throw new Error('The options “extension” and “regex” are mutually exclusive.');
    }
    if (typeof (raw === null || raw === void 0 ? void 0 : raw.regex) === 'string') {
        extension = raw.regex;
    }
    else if ((raw === null || raw === void 0 ? void 0 : raw.extension) != null) {
        extension = raw.extension;
    }
    if (extension != null) {
        normalized.regex = new RegExp('.*.' + extension + '$', 'i'); // eslint-disable-line
    }
    if ((raw === null || raw === void 0 ? void 0 : raw.regex) != null && typeof raw.regex !== 'string') {
        normalized.regex = raw.regex;
    }
    normalized.maxDepths = raw === null || raw === void 0 ? void 0 : raw.maxDepths;
    if ((raw === null || raw === void 0 ? void 0 : raw.payload) != null) {
        normalized.payload = raw.payload;
    }
    return normalized;
}
function walkRecursively(walkFunction, filePaths, opt, depths = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        if (opt.maxDepths != null && opt.maxDepths + 1 < depths) {
            return;
        }
        // A list of file paths.
        if (Array.isArray(filePaths)) {
            for (const filePath of filePaths) {
                yield walkRecursively(walkFunction, filePath, opt);
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
                yield walkFunction.directory(directoryPath, opt.payload);
            }
            if (fs.existsSync(directoryPath)) {
                const files = fs.readdirSync(directoryPath);
                depths++;
                for (const fileName of files) {
                    // Exclude hidden files and directories like '.git'
                    if (fileName.charAt(0) !== '.') {
                        yield walkRecursively(walkFunction, path.join(directoryPath, fileName), opt, depths);
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
                yield walkFunction(filePath, opt.payload);
                return;
            }
            yield callWalkFunctionBundle(walkFunction, filePath, opt.payload);
        }
    });
}
/**
 * Execute a function on one file or walk trough all files matching a
 * regex in the current working directory or in the given directory
 * path.
 *
 * @param walkFunction - A single function or an object containing functions.
 */
export function walk(walkFunction, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof walkFunction === 'object' && (opt === null || opt === void 0 ? void 0 : opt.regex) != null) {
            throw new Error('Use a single function and a regex or an object containing functions without a regex.');
        }
        let filePaths;
        // commander [filepath...] -> without arguments is an empty array.
        if ((opt === null || opt === void 0 ? void 0 : opt.path) == null ||
            (Array.isArray(opt === null || opt === void 0 ? void 0 : opt.path) && (opt === null || opt === void 0 ? void 0 : opt.path.length) === 0)) {
            filePaths = process.cwd();
        }
        else {
            filePaths = opt.path;
        }
        yield walkRecursively(walkFunction, filePaths, normalizeOptions(opt));
    });
}
