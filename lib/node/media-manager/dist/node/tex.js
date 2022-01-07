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
exports.generateCloze = exports.patchTexTitles = void 0;
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Project packages.
const tex_markdown_converter_1 = require("@bldr/tex-markdown-converter");
const titles_1 = require("@bldr/titles");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const tex = __importStar(require("@bldr/tex-templates"));
const log = __importStar(require("@bldr/log"));
const yaml_1 = require("@bldr/yaml");
const core_node_1 = require("@bldr/core-node");
// Local imports.
const main_1 = require("./main");
const location_indicator_1 = require("./location-indicator");
const txt_1 = require("./txt");
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
    const result = tex.cmd('setzetitel', '\n' + tex.keyValues(setzeTitle) + '\n') + '\n';
    return (0, txt_1.removeSpacesAtLineEnd)(result);
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
        const regexp = /\\setzetitel\{.+?,?\n\}\n/s;
        texFileContentPatched = texFileContent.replace(regexp, patchedTitles);
    }
    else {
        texFileContentPatched = texFileContent.replace(/(\\documentclass(\[.*\])?\{schule-arbeitsblatt\})/, '$1\n\n' + patchedTitles);
    }
    if (texFileContent !== texFileContentPatched) {
        log.info('Patch titles in TeX file %s', [filePath]);
        log.verbose(log.colorizeDiff(texFileContent, texFileContentPatched));
        (0, file_reader_writer_1.writeFile)(filePath, texFileContentPatched);
        return true;
    }
    log.verbose('Nothing to patch in TeX file %s', [filePath]);
    return false;
}
exports.patchTexTitles = patchTexTitles;
function initializeMetaYaml(pdfFile, dest, pageNo, pageCount) {
    if (fs_1.default.existsSync(dest)) {
        return;
    }
    // Write info yaml
    const titles = new titles_1.DeepTitle(pdfFile);
    const infoYaml = {
        ref: `${titles.ref}_LT_${pageNo}`,
        title: `Lückentext zum Thema „${titles.title}“ (Seite ${pageNo} von ${pageCount})`,
        meta_types: 'cloze',
        cloze_page_no: pageNo,
        cloze_page_count: pageCount
    };
    const yamlContent = (0, yaml_1.convertToYaml)(infoYaml);
    log.debug(yamlContent);
    (0, file_reader_writer_1.writeFile)(dest, yamlContent);
}
function generateSvg(tmpPdfFile, destDir, pageCount, pageNo) {
    return __awaiter(this, void 0, void 0, function* () {
        log.info('Convert page %s from %s', [pageNo.toString(), pageCount.toString()]);
        const svgFileName = `${pageNo}.svg`;
        const svgFilePath = path_1.default.join(destDir, svgFileName);
        fs_1.default.mkdirSync(destDir, { recursive: true });
        // Convert into SVG
        child_process_1.default.spawnSync('pdf2svg', [tmpPdfFile, svgFileName, pageNo.toString()], { cwd: destDir });
        // Remove width="" and height="" attributes
        let svgContent = (0, file_reader_writer_1.readFile)(svgFilePath);
        svgContent = svgContent.replace(/(width|height)=".+?" /g, '');
        (0, file_reader_writer_1.writeFile)(svgFilePath, svgContent);
        // Move to LT (Lückentext) subdir.
        const destPath = path_1.default.join(destDir, svgFileName);
        initializeMetaYaml(tmpPdfFile, `${destPath}.yml`, pageNo, pageCount);
        log.info('Result svg: %s', [destPath]);
        main_1.operations.moveAsset(svgFilePath, destPath);
        yield main_1.operations.normalizeMediaAsset(destPath, { wikidata: false });
    });
}
function patchTex(content) {
    return content
        .replace(/\\VerbergeLoesung/g, '')
        .replace(/\\ZeigeLoesung/g, '')
        .replace(/\\ZeigeNurLueckentextLoesung/g, '')
        .replace('\\begin{document}', '\\begin{document}\n\\ZeigeNurLueckentextLoesung');
}
function compileTex(tmpTexFile) {
    const jobName = path_1.default.basename(tmpTexFile).replace('.tex', '');
    const tmpDir = path_1.default.dirname(tmpTexFile);
    const result = child_process_1.default.spawnSync('lualatex', ['--shell-escape', tmpTexFile], { cwd: tmpDir, encoding: 'utf-8' });
    if (result.status !== 0) {
        if (result.stdout != null) {
            log.error(result.stdout);
        }
        if (result.stderr != null) {
            log.error(result.stderr);
        }
        throw new Error('lualatex compilation failed.');
    }
    const tmpPdf = path_1.default.join(tmpDir, `${jobName}.pdf`);
    log.debug('Compiled to temporary PDF: %s', [tmpPdf]);
    return tmpPdf;
}
/**
 * @param filePath - The file path of a TeX file.
 */
function generateCloze(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        filePath = path_1.default.resolve(filePath);
        const texFileContent = (0, file_reader_writer_1.readFile)(filePath);
        if (!texFileContent.includes('cloze')) {
            log.warn('%s has no cloze texts.', [filePath]);
            return;
        }
        log.debug('Resolved input path: %s', [filePath]);
        // Move to LT (Lückentext) subdir.
        const parentDir = location_indicator_1.locationIndicator.getPresParentDir(filePath);
        if (parentDir == null) {
            throw new Error('Parent dir couldn’t be detected!');
        }
        const destDir = path_1.default.join(parentDir, 'LT');
        const tmpTexFile = filePath.replace('.tex', '_Loesung.tex');
        log.debug('Create temporary file %s', [tmpTexFile]);
        (0, file_reader_writer_1.writeFile)(tmpTexFile, patchTex(texFileContent));
        log.info('Generate SVGs from the file %s.', [tmpTexFile]);
        const tmpPdfFile = compileTex(tmpTexFile);
        const pageCount = (0, core_node_1.getPdfPageCount)(tmpPdfFile);
        for (let pageNo = 1; pageNo <= pageCount; pageNo++) {
            yield generateSvg(tmpPdfFile, destDir, pageCount, pageNo);
        }
        fs_1.default.unlinkSync(tmpTexFile);
        fs_1.default.unlinkSync(tmpPdfFile);
    });
}
exports.generateCloze = generateCloze;
