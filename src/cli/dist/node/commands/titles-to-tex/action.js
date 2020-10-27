// Third party packages.
const chalk = require('chalk');
// Project packages.
const mediaServer = require('@bldr/media-server');
const { convertMdToTex } = require('@bldr/tex-markdown-converter');
const { readFile, writeFile } = require('@bldr/media-manager');
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
    console.log(`\nReplace titles in TeX file “${chalk.yellow(filePath)}”\n`);
    const titles = new mediaServer.HierarchicalFolderTitles(filePath);
    const setzeTitle = {
        jahrgangsstufe: titles.grade
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
        setzeTitle[key] = convertMdToTex(setzeTitle[key]);
    }
    const lines = ['\\setzetitel{'];
    for (const key in setzeTitle) {
        lines.push(`  ${key} = {${setzeTitle[key]}},`);
    }
    lines.push('}');
    lines.push(''); // to get an empty line
    const patchedTitles = lines.join('\n');
    let texFileString = readFile(filePath);
    // /s s (dotall) modifier, +? one or more (non-greedy)
    const regexp = new RegExp(/\\setzetitel\{.+?,?\n\}\n/, 's');
    const match = texFileString.match(regexp);
    if (match) {
        const unpatchedTitles = match[0];
        if (unpatchedTitles !== patchedTitles) {
            console.log(chalk.yellow(unpatchedTitles));
            texFileString = texFileString.replace(regexp, patchedTitles);
            writeFile(filePath, texFileString);
        }
        console.log(chalk.green(patchedTitles));
        if (unpatchedTitles === patchedTitles) {
            console.log('No changes!');
        }
    }
}
/**
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action(files) {
    mediaServer.walk(patchTexFileWithTitles, {
        path: files,
        regex: 'tex'
    });
}
module.exports = action;
