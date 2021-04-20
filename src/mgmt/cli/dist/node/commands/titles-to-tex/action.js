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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const tex_markdown_converter_1 = require("@bldr/tex-markdown-converter");
const media_manager_1 = require("@bldr/media-manager");
const titles_1 = require("@bldr/titles");
const core_node_1 = require("@bldr/core-node");
const log = __importStar(require("@bldr/log"));
/**
 * ```tex
 * \setzetitel{
 *   jahrgangsstufe = {6},
 *   ebenei = {Musik und ihre Grundlagen},
 *   ebeneii = {Systeme und Strukturen},
 *   ebeneiii = {die Tongeschlechter Dur und Moll},
 *   titel = {Dur- und Moll-Tonleiter},
 *   untertitel = {Das Lied \emph{„Kol dodi“} in Moll und Dur},
 * }
 * ```
 *
 * @param filePath - The path of a TeX file.
 */
function patchTexFileWithTitles(filePath) {
    log.info('\nReplace titles in TeX file “%s”', filePath);
    const titles = new titles_1.DeepTitle(filePath);
    log.infoLog(titles);
    const setzeTitle = {
        jahrgangsstufe: titles.grade.toString()
    };
    const ebenen = ['ebenei', 'ebeneii', 'ebeneiii', 'ebeneiv', 'ebenev'];
    for (let index = 0; index < titles.curriculumTitlesArray.length; index++) {
        setzeTitle[ebenen[index]] = titles.curriculumTitlesArray[index];
    }
    setzeTitle.titel = titles.title;
    if (titles.subtitle) {
        setzeTitle.untertitel = titles.subtitle;
    }
    // Replace semantic markup
    for (const key in setzeTitle) {
        setzeTitle[key] = tex_markdown_converter_1.convertMdToTex(setzeTitle[key]);
    }
    const lines = ['\\setzetitel{'];
    for (const key in setzeTitle) {
        lines.push(`  ${key} = {${setzeTitle[key]}},`);
    }
    lines.push('}');
    lines.push(''); // to get an empty line
    const patchedTitles = lines.join('\n');
    let texFileString = core_node_1.readFile(filePath);
    // /s s (dotall) modifier, +? one or more (non-greedy)
    const regexp = new RegExp(/\\setzetitel\{.+?,?\n\}\n/, 's');
    const match = texFileString.match(regexp);
    if (match) {
        const unpatchedTitles = match[0];
        if (unpatchedTitles !== patchedTitles) {
            console.log(chalk_1.default.yellow(unpatchedTitles));
            texFileString = texFileString.replace(regexp, patchedTitles);
            core_node_1.writeFile(filePath, texFileString);
        }
        log.info(patchedTitles);
        if (unpatchedTitles === patchedTitles) {
            log.info('No changes!');
        }
    }
}
/**
 * Replace the title section of the TeX files with metadata retrieved
 * from the title.txt files.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 */
function action(filePaths) {
    media_manager_1.walk(patchTexFileWithTitles, {
        path: filePaths,
        regex: 'tex'
    });
}
module.exports = action;
