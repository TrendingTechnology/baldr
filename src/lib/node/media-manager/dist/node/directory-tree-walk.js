"use strict";
/**
 * Walk through a tree of files and directories.
 *
 * @module @bldr/media-manager/directory-tree-walk
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.walk = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const media = __importStar(require("./media-file-classes"));
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
    let extension = undefined;
    if (typeof raw.regex === 'string' && raw.extension != null) {
        throw new Error('The options “extension” and “regex” are mutually exclusive.');
    }
    if (typeof raw.regex === 'string') {
        extension = raw.regex;
    }
    else if (raw.extension != null) {
        extension = raw.extension;
    }
    if (extension != null) {
        normalized.regex = new RegExp('.*.' + extension + '$', 'i'); // eslint-disable-line
    }
    if (raw.payload != null) {
        normalized.payload = raw.payload;
    }
    return normalized;
}
function walkRecursively(walkFunction, filePaths, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        // A list of file paths.
        if (Array.isArray(filePaths)) {
            for (const relPath of filePaths) {
                yield walkRecursively(walkFunction, relPath, opt);
            }
            return;
        }
        // Rename action: Rename during walk, filePaths can change
        if (!fs_1.default.existsSync(filePaths)) {
            return;
        }
        // A directory.
        if (fs_1.default.statSync(filePaths).isDirectory()) {
            if (typeof walkFunction !== 'function' && walkFunction.directory != null) {
                yield walkFunction.directory(filePaths, opt.payload);
            }
            if (fs_1.default.existsSync(filePaths)) {
                const files = fs_1.default.readdirSync(filePaths);
                for (const fileName of files) {
                    // Exclude hidden files and directories like '.git'
                    if (fileName.charAt(0) !== '.') {
                        const relPath = path_1.default.join(filePaths, fileName);
                        yield walkRecursively(walkFunction, relPath, opt);
                    }
                }
            }
            // A single file.
        }
        else {
            // Exclude hidden files and directories like '.git'
            if (path_1.default.basename(filePaths).charAt(0) === '.') {
                return;
            }
            if (!fs_1.default.existsSync(filePaths)) {
                return;
            }
            if (opt.regex != null) {
                if (filePaths.match(opt.regex) == null) {
                    return;
                }
            }
            if (typeof walkFunction === 'function') {
                yield walkFunction(filePaths, opt.payload);
                return;
            }
            yield callWalkFunctionBundle(walkFunction, filePaths, opt.payload);
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
function walk(walkFunction, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        // Some checks to exit early.
        if (typeof opt !== 'object') {
            opt = {};
        }
        if (typeof walkFunction === 'object' && opt.regex != null) {
            throw new Error('Use a single function and a regex or an object containing functions without a regex.');
        }
        // commander [filepath...] -> without arguments is an empty array.
        if (opt.path == null || (Array.isArray(opt.path) && opt.path.length === 0)) {
            opt.path = process.cwd();
        }
        // A list of file paths.
        if (Array.isArray(opt.path)) {
            for (const relPath of opt.path) {
                yield walk(walkFunction, {
                    path: relPath,
                    payload: opt.payload,
                    regex: opt.regex
                });
            }
            return;
        }
        // Rename action: Rename during walk, opt.path can change
        if (!fs_1.default.existsSync(opt.path)) {
            return;
        }
        // A directory.
        if (fs_1.default.statSync(opt.path).isDirectory()) {
            if (typeof walkFunction !== 'function' && walkFunction.directory != null) {
                yield walkFunction.directory(opt.path, opt.payload);
            }
            if (fs_1.default.existsSync(opt.path)) {
                const files = fs_1.default.readdirSync(opt.path);
                for (const fileName of files) {
                    // Exclude hidden files and directories like '.git'
                    if (fileName.charAt(0) !== '.') {
                        const relPath = path_1.default.join(opt.path, fileName);
                        yield walk(walkFunction, {
                            path: relPath,
                            payload: opt.payload,
                            regex: opt.regex
                        });
                    }
                }
            }
            // A single file.
        }
        else {
            // Exclude hidden files and directories like '.git'
            if (path_1.default.basename(opt.path).charAt(0) === '.') {
                return;
            }
            if (!fs_1.default.existsSync(opt.path)) {
                return;
            }
            if (opt.regex != null) {
                // If regex is a string it is treated as an extension.
                if (typeof opt.regex === 'string') {
                    opt.regex = new RegExp('.*.' + opt.regex + '$', 'i'); // eslint-disable-line
                }
                if (opt.path.match(opt.regex) == null) {
                    return;
                }
            }
            if (typeof walkFunction === 'function') {
                yield walkFunction(opt.path, opt.payload);
                return;
            }
            yield callWalkFunctionBundle(walkFunction, opt.path, opt.payload);
        }
    });
}
exports.walk = walk;
