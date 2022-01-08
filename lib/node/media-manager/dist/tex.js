import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';
// Project packages.
import { convertMdToTex } from '@bldr/tex-markdown-converter';
import { DeepTitle } from '@bldr/titles';
import { readFile, writeFile } from '@bldr/file-reader-writer';
import * as tex from '@bldr/tex-templates';
import * as log from '@bldr/log';
import { convertToYaml } from '@bldr/yaml';
import { getPdfPageCount } from '@bldr/core-node';
// Local imports.
import { operations } from './main';
import { locationIndicator } from './location-indicator';
import { removeSpacesAtLineEnd } from './txt';
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
        setzeTitle[key] = convertMdToTex(setzeTitle[key]);
    }
    const result = tex.cmd('setzetitel', '\n' + tex.keyValues(setzeTitle) + '\n') + '\n';
    return removeSpacesAtLineEnd(result);
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
export function patchTexTitles(filePath) {
    const titles = new DeepTitle(filePath);
    const patchedTitles = makeTexMarkup(titles);
    const texFileContent = readFile(filePath);
    let texFileContentPatched;
    if (texFileContent.includes('\\setzetitel{')) {
        // /s s (dotall) modifier, +? one or more (non-greedy)
        const regexp = /\\setzetitel\{.+?,?\n\}\n/s;
        texFileContentPatched = texFileContent.replace(regexp, patchedTitles);
    }
    else {
        texFileContentPatched = texFileContent.replace(/(\\documentclass(\[.*\])?\{schule-arbeitsblatt\})/, '$1\n\n' + patchedTitles);
    }
    if (texFileContent !== texFileContentPatched) {
        log.info('Patch titles in TeX file %s', [filePath]);
        log.verbose(log.colorizeDiff(texFileContent, texFileContentPatched));
        writeFile(filePath, texFileContentPatched);
        return true;
    }
    log.verbose('Nothing to patch in TeX file %s', [filePath]);
    return false;
}
function initializeMetaYaml(pdfFile, dest, pageNo, pageCount) {
    if (fs.existsSync(dest)) {
        return;
    }
    // Write info yaml
    const titles = new DeepTitle(pdfFile);
    const infoYaml = {
        ref: `${titles.ref}_LT_${pageNo}`,
        title: `Lückentext zum Thema „${titles.title}“ (Seite ${pageNo} von ${pageCount})`,
        meta_types: 'cloze',
        cloze_page_no: pageNo,
        cloze_page_count: pageCount
    };
    const yamlContent = convertToYaml(infoYaml);
    log.debug(yamlContent);
    writeFile(dest, yamlContent);
}
async function generateSvg(tmpPdfFile, destDir, pageCount, pageNo) {
    log.info('Convert page %s from %s', [pageNo.toString(), pageCount.toString()]);
    const svgFileName = `${pageNo}.svg`;
    const svgFilePath = path.join(destDir, svgFileName);
    fs.mkdirSync(destDir, { recursive: true });
    // Convert into SVG
    childProcess.spawnSync('pdf2svg', [tmpPdfFile, svgFileName, pageNo.toString()], { cwd: destDir });
    // Remove width="" and height="" attributes
    let svgContent = readFile(svgFilePath);
    svgContent = svgContent.replace(/(width|height)=".+?" /g, '');
    writeFile(svgFilePath, svgContent);
    // Move to LT (Lückentext) subdir.
    const destPath = path.join(destDir, svgFileName);
    initializeMetaYaml(tmpPdfFile, `${destPath}.yml`, pageNo, pageCount);
    log.info('Result svg: %s', [destPath]);
    operations.moveAsset(svgFilePath, destPath);
    await operations.normalizeMediaAsset(destPath, { wikidata: false });
}
function patchTex(content) {
    return content
        .replace(/\\VerbergeLoesung/g, '')
        .replace(/\\ZeigeLoesung/g, '')
        .replace(/\\ZeigeNurLueckentextLoesung/g, '')
        .replace('\\begin{document}', '\\begin{document}\n\\ZeigeNurLueckentextLoesung');
}
function compileTex(tmpTexFile) {
    const jobName = path.basename(tmpTexFile).replace('.tex', '');
    const tmpDir = path.dirname(tmpTexFile);
    const result = childProcess.spawnSync('lualatex', ['--shell-escape', tmpTexFile], { cwd: tmpDir, encoding: 'utf-8' });
    if (result.status !== 0) {
        if (result.stdout != null) {
            log.error(result.stdout);
        }
        if (result.stderr != null) {
            log.error(result.stderr);
        }
        throw new Error('lualatex compilation failed.');
    }
    const tmpPdf = path.join(tmpDir, `${jobName}.pdf`);
    log.debug('Compiled to temporary PDF: %s', [tmpPdf]);
    return tmpPdf;
}
/**
 * @param filePath - The file path of a TeX file.
 */
export async function generateCloze(filePath) {
    filePath = path.resolve(filePath);
    const texFileContent = readFile(filePath);
    if (!texFileContent.includes('cloze')) {
        log.warn('%s has no cloze texts.', [filePath]);
        return;
    }
    log.debug('Resolved input path: %s', [filePath]);
    // Move to LT (Lückentext) subdir.
    const parentDir = locationIndicator.getPresParentDir(filePath);
    if (parentDir == null) {
        throw new Error('Parent dir couldn’t be detected!');
    }
    const destDir = path.join(parentDir, 'LT');
    const tmpTexFile = filePath.replace('.tex', '_Loesung.tex');
    log.debug('Create temporary file %s', [tmpTexFile]);
    writeFile(tmpTexFile, patchTex(texFileContent));
    log.info('Generate SVGs from the file %s.', [tmpTexFile]);
    const tmpPdfFile = compileTex(tmpTexFile);
    const pageCount = getPdfPageCount(tmpPdfFile);
    for (let pageNo = 1; pageNo <= pageCount; pageNo++) {
        await generateSvg(tmpPdfFile, destDir, pageCount, pageNo);
    }
    fs.unlinkSync(tmpTexFile);
    fs.unlinkSync(tmpPdfFile);
}
