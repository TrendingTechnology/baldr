"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walk = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const media_file_classes_1 = require("./media-file-classes");
/**
 * Execute a function on one file or walk trough all files matching a
 * regex in the current working directory or in the given directory
 * path.
 *
 * @param func - A single function or an object containing functions.
 */
function walk(func, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        // Some checks to exit early.
        if (!func) {
            throw new Error('Missing property: `func`.');
        }
        if (typeof opt !== 'object')
            opt = {};
        if (typeof func === 'object' && opt.regex) {
            throw new Error('Use a single function and a regex or an object containing functions without a regex.');
        }
        // commander [filepath...] -> without arguments is an empty array.
        if (!opt.path || (Array.isArray(opt.path) && opt.path.length === 0)) {
            opt.path = process.cwd();
        }
        // A list of file paths.
        if (Array.isArray(opt.path)) {
            for (const relPath of opt.path) {
                yield walk(func, { path: relPath, payload: opt.payload, regex: opt.regex });
            }
            return;
        }
        // Rename action: Rename during walk, opt.path can change
        if (!fs_1.default.existsSync(opt.path)) {
            return;
        }
        // A directory.
        if (fs_1.default.statSync(opt.path).isDirectory()) {
            if (typeof func !== 'function' && (func.directory != null)) {
                yield func.directory(opt.path, opt.payload);
            }
            if (fs_1.default.existsSync(opt.path)) {
                const files = fs_1.default.readdirSync(opt.path);
                for (const fileName of files) {
                    // Exclude hidden files and directories like '.git'
                    if (fileName.charAt(0) !== '.') {
                        const relPath = path_1.default.join(opt.path, fileName);
                        yield walk(func, { path: relPath, payload: opt.payload, regex: opt.regex });
                    }
                }
            }
            // A single file.
        }
        else {
            // Exclude hidden files and directories like '.git'
            if (path_1.default.basename(opt.path).charAt(0) === '.')
                return;
            if (!fs_1.default.existsSync(opt.path))
                return;
            if (opt.regex) {
                // If regex is a string it is treated as an extension.
                if (typeof opt.regex === 'string') {
                    opt.regex = new RegExp('.*\.' + opt.regex + '$', 'i'); // eslint-disable-line
                }
                if (opt.path.match(opt.regex) == null) {
                    return;
                }
            }
            if (typeof func === 'function') {
                yield func(opt.path, opt.payload);
                return;
            }
            if (func.everyFile != null) {
                yield func.everyFile(opt.path, opt.payload);
            }
            const isPres = media_file_classes_1.isPresentation(opt.path);
            const isAss = media_file_classes_1.isAsset(opt.path);
            if ((isPres || isAss) && (func.all != null)) {
                yield func.all(opt.path, opt.payload);
            }
            if (isPres && (func.presentation != null)) {
                yield func.presentation(opt.path, opt.payload);
            }
            else if (isAss && (func.asset != null)) {
                yield func.asset(opt.path, opt.payload);
            }
        }
    });
}
exports.walk = walk;
