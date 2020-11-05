"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const tex_markdown_converter_1 = require("@bldr/tex-markdown-converter");
const media_manager_1 = require("@bldr/media-manager");
const core_node_1 = require("@bldr/core-node");
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
 * @param {String} filePath - The path of a TeX file.
 */
function patchTexFileWithTitles(filePath) {
    console.log(`\nReplace titles in TeX file “${chalk_1.default.yellow(filePath)}”\n`);
    const titles = new media_manager_1.DeepTitle(filePath);
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
        console.log(chalk_1.default.green(patchedTitles));
        if (unpatchedTitles === patchedTitles) {
            console.log('No changes!');
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
