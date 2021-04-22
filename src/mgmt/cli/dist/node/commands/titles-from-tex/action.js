"use strict";
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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const tex_markdown_converter_1 = require("@bldr/tex-markdown-converter");
const media_manager_1 = require("@bldr/media-manager");
const core_node_1 = require("@bldr/core-node");
function clean(text) {
    text = text.replace(/\n/g, ' ');
    text = text.replace(/\s+/g, ' ');
    text = tex_markdown_converter_1.convertTexToMd(text);
    return text;
}
function convertTexToFolderTitles(filePath, payload) {
    const cmdObj = payload;
    const content = core_node_1.readFile(filePath);
    const matchTitle = content.match(/ {2}titel = \{(.+?)\}[,\n]/s);
    const output = [];
    let title = '';
    let subtitle = '';
    if (matchTitle != null) {
        title = clean(matchTitle[1]);
        output.push(title);
    }
    const matchSubtitle = content.match(/ {2}untertitel = \{(.+?)\}[,\n]/s);
    if (matchSubtitle != null) {
        subtitle = clean(matchSubtitle[1]);
        output.push(subtitle);
    }
    if (output.length > 0) {
        const destBasePath = path_1.default.resolve(path_1.default.dirname(filePath), '..');
        let dest;
        const destFinal = path_1.default.join(destBasePath, 'title.txt');
        if (!fs_1.default.existsSync(destFinal) || cmdObj.force) {
            dest = destFinal;
        }
        else {
            dest = path_1.default.join(destBasePath, 'title_tmp.txt');
        }
        const presFile = path_1.default.join(destBasePath, 'Praesentation.baldr.yml');
        if (!fs_1.default.existsSync(presFile) || cmdObj.force) {
            core_node_1.writeFile(presFile, '---\n');
        }
        console.log(chalk_1.default.green(dest));
        console.log(`  title: ${chalk_1.default.blue(title)}`);
        console.log(`  subtitle: ${chalk_1.default.cyan(subtitle)}\n`);
        core_node_1.writeFile(dest, output.join('\n') + '\n');
    }
}
/**
 * Create from the TeX files the folder titles text file `title.txt`.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(filePaths, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        yield media_manager_1.walk(convertTexToFolderTitles, {
            path: filePaths,
            regex: 'tex',
            payload: cmdObj
        });
    });
}
module.exports = action;
