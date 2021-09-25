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
exports.generateCloze = void 0;
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Project packages.
const log = __importStar(require("@bldr/log"));
const main_1 = require("../main");
const location_indicator_1 = require("../location-indicator");
const titles_1 = require("@bldr/titles");
const yaml_1 = require("@bldr/yaml");
const core_node_1 = require("@bldr/core-node");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
function initializeMetaYaml(pdfFile, dest, pageNo, pageCount) {
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
        log.info('Convert page %s from %s', pageNo.toString(), pageCount.toString());
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
        log.info('Result svg: %s', destPath);
        (0, main_1.moveAsset)(svgFilePath, destPath);
        yield main_1.operations.normalizeMediaAsset(destPath, { wikidata: false });
    });
}
function patchTex(content) {
    // Show cloze texts by patching the TeX file and generate a PDF file.
    // \documentclass[angabe,querformat]{schule-arbeitsblatt}
    return content.replace(/\\documentclass(\[(.*)\])?\{schule-arbeitsblatt\}/, function (match, p1, p2) {
        // match \documentclass[angabe,querformat]{schule-arbeitsblatt}
        // p1: [angabe,querformat]
        // p2: angabe,querformat
        let args = [];
        let isSolutionSet = false;
        if (p2 != null) {
            args = p2.split(',');
            for (let index = 0; index < args.length; index++) {
                if (args[index] === 'angabe') {
                    args[index] = 'loesung';
                    isSolutionSet = true;
                }
            }
            if (args.includes('loesung')) {
                isSolutionSet = true;
            }
        }
        if (!isSolutionSet) {
            args.push('loesung');
        }
        return `\\documentclass[${args.join(',')}]{schule-arbeitsblatt}`;
    });
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
    log.debug('Compiled to temporary PDF: %s', tmpPdf);
    return tmpPdf;
}
/**
 * @param filePath - The file path of a TeX file.
 */
function generateCloze(filePath, logLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        log.setLogLevel(5);
        filePath = path_1.default.resolve(filePath);
        const texFileContent = (0, file_reader_writer_1.readFile)(filePath);
        if (!texFileContent.includes('cloze')) {
            log.warn('%s has no cloze texts.', filePath);
            return;
        }
        log.debug('Resolved input path: %s', filePath);
        // Move to LT (Lückentext) subdir.
        const parentDir = location_indicator_1.locationIndicator.getPresParentDir(filePath);
        if (parentDir == null) {
            throw new Error('Parent dir couldn’t be detected!');
        }
        const destDir = path_1.default.join(parentDir, 'LT');
        const tmpTexFile = filePath.replace('.tex', '_Loesung.tex');
        log.debug('Create temporary file %s', tmpTexFile);
        (0, file_reader_writer_1.writeFile)(tmpTexFile, patchTex(texFileContent));
        log.info('Generate SVGs from the file %s.', tmpTexFile);
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
