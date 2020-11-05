"use strict";
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
const core_node_1 = require("@bldr/core-node");
/**
 * @param input - A file path or a text string to convert.
 */
function convertTexToMarkdown(input) {
    let content;
    if (!fs_1.default.existsSync(input)) {
        content = input;
    }
    else {
        console.log(chalk_1.default.green(media_manager_1.locationIndicator.getRelPath(input)));
        content = core_node_1.readFile(input);
    }
    console.log('\n' + chalk_1.default.yellow('Original:') + '\n');
    console.log(content);
    content = tex_markdown_converter_1.convertTexToMd(content);
    console.log(chalk_1.default.green('Converted:'));
    console.log(content);
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
    if (Array.isArray(filesOrText) && filesOrText.length > 0 && !fs_1.default.existsSync(filesOrText[0])) {
        convertTexToMarkdown(filesOrText[0]);
    }
    else {
        media_manager_1.walk(convertTexToMarkdown, {
            path: filesOrText,
            regex: 'tex'
        });
    }
}
module.exports = action;
