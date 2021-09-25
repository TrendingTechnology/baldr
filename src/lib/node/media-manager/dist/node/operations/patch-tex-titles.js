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
const log = __importStar(require("@bldr/log"));
/**
 * @returns A TeX markup like this output:
 *
 * ```tex
 * \setzetitel{
 *   Fach = Musik,
 *   Jahrgangsstufe = 6,
 *   Ebenen = {
 *     { Musik und ihre Grundlagen },
 *     { Systeme und Strukturen },
 *     { die Tongeschlechter Dur und Moll },
 *   },
 *   Titel = { Dur- und Moll-Tonleiter },
 *   Untertitel = { Das Lied \emph{„Kol dodi“} in Moll und Dur },
 * }
 * ```
 */
function makeTexMarkup(titles) {
    const setzeTitle = {
        Fach: titles.subject,
        Jahrgangsstufe: titles.grade.toString()
    };
    const ebenen = [];
    for (const title of titles.curriculumTitlesArrayFromGrade) {
        ebenen.push(`    { ${title} },`);
    }
    setzeTitle.Ebenen = '\n' + ebenen.join('\n') + '\n ';
    setzeTitle.Titel = titles.title;
    if (titles.subtitle != null) {
        setzeTitle.Untertitel = titles.subtitle;
    }
    // Replace semantic markup
    for (const key in setzeTitle) {
        setzeTitle[key] = (0, tex_markdown_converter_1.convertMdToTex)(setzeTitle[key]);
    }
    return tex.cmd('setzetitel', '\n' + tex.keyValues(setzeTitle) + '\n') + '\n';
}
/**
 * ```tex
 * \setzetitel{
 *   Fach = Musik,
 *   Jahrgangsstufe = 6,
 *   Ebenen = {
 *     { Musik und ihre Grundlagen },
 *     { Systeme und Strukturen },
 *     { die Tongeschlechter Dur und Moll },
 *   },
 *   Titel = { Dur- und Moll-Tonleiter },
 *   Untertitel = { Das Lied \emph{„Kol dodi“} in Moll und Dur },
 * }
 * ```
 *
 * @param filePath - The path of a TeX file.
 */
function patchTexTitles(filePath) {
    const titles = new titles_1.DeepTitle(filePath);
    const patchedTitles = makeTexMarkup(titles);
    const texFileContent = (0, file_reader_writer_1.readFile)(filePath);
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
        log.info('Patch titles in TeX file %s', filePath);
        log.verbose(log.colorizeDiff(texFileContent, texFileContentPatched));
        (0, file_reader_writer_1.writeFile)(filePath, texFileContentPatched);
        return true;
    }
    log.verbose('Nothing to patch in TeX file %s', filePath);
    return false;
}
exports.patchTexTitles = patchTexTitles;
