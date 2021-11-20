"use strict";
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
// Node packages.
const fs_1 = __importDefault(require("fs"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const tex_markdown_converter_1 = require("@bldr/tex-markdown-converter");
const media_manager_1 = require("@bldr/media-manager");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const log = __importStar(require("@bldr/log"));
/**
 * @param input - A file path or a text string to convert.
 */
function convertTexToMarkdown(input) {
    let content;
    if (!fs_1.default.existsSync(input)) {
        content = input;
    }
    else {
        log.info(chalk_1.default.green(media_manager_1.locationIndicator.getRelPath(input)));
        content = (0, file_reader_writer_1.readFile)(input);
    }
    log.info('\n' + chalk_1.default.yellow('Original:') + '\n');
    log.info(content);
    content = (0, tex_markdown_converter_1.convertTexToMd)(content);
    log.info(chalk_1.default.green('Converted:'));
    log.info(content);
    return content;
}
/**
 * Convert TeX to markdown.
 *
 * @param {Array} filesOrText - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]` or a text block in the first element
 *   of the array.
 */
function action(filesOrText) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(filesOrText) && filesOrText.length > 0 && !fs_1.default.existsSync(filesOrText[0])) {
            convertTexToMarkdown(filesOrText[0]);
        }
        else {
            yield (0, media_manager_1.walk)(convertTexToMarkdown, {
                path: filesOrText,
                regex: 'tex'
            });
        }
    });
}
module.exports = action;
