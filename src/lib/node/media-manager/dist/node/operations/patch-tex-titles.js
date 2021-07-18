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
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchTexTitles = void 0;
// Project packages.
const tex_markdown_converter_1 = require("@bldr/tex-markdown-converter");
const titles_1 = require("@bldr/titles");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const tex = __importStar(require("@bldr/tex-templates"));
/**
 * @returns A TeX markup like this output:
 *
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
 */
function makeTexMarkup(titles) {
    const setzeTitle = {
        jahrgangsstufe: titles.grade.toString()
    };
    const ebenen = ['ebenei', 'ebeneii', 'ebeneiii', 'ebeneiv', 'ebenev'];
    for (let index = 0; index < titles.curriculumTitlesArrayFromGrade.length; index++) {
        setzeTitle[ebenen[index]] = titles.curriculumTitlesArrayFromGrade[index];
    }
    setzeTitle.titel = titles.title;
    if (titles.subtitle != null) {
        setzeTitle.untertitel = titles.subtitle;
    }
    // Replace semantic markup
    for (const key in setzeTitle) {
        setzeTitle[key] = tex_markdown_converter_1.convertMdToTex(setzeTitle[key]);
    }
    return tex.cmd('setzetitel', '\n' + tex.keyValues(setzeTitle) + '\n') + '\n';
}
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
function patchTexTitles(filePath) {
    const titles = new titles_1.DeepTitle(filePath);
    const patchedTitles = makeTexMarkup(titles);
    const texFileContent = file_reader_writer_1.readFile(filePath);
    let texFileContentPatched;
    if (texFileContent.includes('\\setzetitel{')) {
        // /s s (dotall) modifier, +? one or more (non-greedy)
        const regexp = new RegExp(/\\setzetitel\{.+?,?\n\}\n/, 's');
        texFileContentPatched = texFileContent.replace(regexp, patchedTitles);
    }
    else {
        texFileContentPatched = texFileContent.replace(/(\\documentclass(\[.*\])?\{schule-arbeitsblatt\})/, '$1\n\n' + patchedTitles);
    }
    if (texFileContent !== texFileContentPatched) {
        file_reader_writer_1.writeFile(filePath, texFileContentPatched);
        return true;
    }
    return false;
}
exports.patchTexTitles = patchTexTitles;
