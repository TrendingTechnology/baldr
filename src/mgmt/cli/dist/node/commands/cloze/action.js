"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
const yaml_1 = require("@bldr/yaml");
const core_node_1 = require("@bldr/core-node");
function generateOneClozeSvg(tmpPdfFile, pageCount, pageNo) {
    const cwd = path_1.default.dirname(tmpPdfFile);
    let counterSuffix = '';
    if (pageCount > 1) {
        counterSuffix = `_${pageNo}`;
    }
    console.log(`Convert page ${chalk_1.default.green(pageNo)}`);
    const svgFileName = `Lueckentext${counterSuffix}.svg`;
    const svgFilePath = path_1.default.join(cwd, svgFileName);
    // Convert into SVG
    child_process_1.default.spawnSync('pdf2svg', [tmpPdfFile, svgFileName, pageNo.toString()], { cwd });
    // Remove width="" and height="" attributes
    let svgContent = core_node_1.readFile(svgFilePath);
    svgContent = svgContent.replace(/(width|height)=".+?" /g, '');
    core_node_1.writeFile(svgFilePath, svgContent);
    // Write info yaml
    const titles = new media_manager_1.DeepTitle(tmpPdfFile);
    const infoYaml = {
        id: `${titles.id}_LT${counterSuffix}`,
        title: `Lückentext zum Thema „${titles.title}“ (Seite ${pageNo} von ${pageCount})`,
        meta_types: 'cloze',
        cloze_page_no: pageNo,
        cloze_page_count: pageCount
    };
    core_node_1.writeFile(path_1.default.join(cwd, `${svgFileName}.yml`), yaml_1.convertToYaml(infoYaml));
    // Move to LT (Lückentext) subdir.
    const newPath = media_manager_1.locationIndicator.moveIntoSubdir(path_1.default.resolve(svgFileName), 'LT');
    media_manager_1.moveAsset(svgFilePath, newPath);
    media_manager_1.operations.normalizeMediaAsset(newPath, { wikidata: false });
}
/**
 * @param {String} filePath
 */
function generateClozeSvg(filePath) {
    filePath = path_1.default.resolve(filePath);
    console.log(filePath);
    const cwd = path_1.default.dirname(filePath);
    let texFileContent = core_node_1.readFile(filePath);
    if (texFileContent.indexOf('cloze') === -1) {
        console.log(`${chalk_1.default.red(filePath)} has no cloze texts.`);
        return;
    }
    const tmpTexFile = filePath.replace('.tex', '_Loesung.tex');
    console.log(`Generate SVGs from the file ${chalk_1.default.yellow(filePath)}.`);
    const jobName = path_1.default.basename(tmpTexFile).replace('.tex', '');
    // Show cloze texts by patching the TeX file and generate a PDF file.
    // \documentclass[angabe,querformat]{schule-arbeitsblatt}
    texFileContent = texFileContent.replace(/\\documentclass(\[(.*)\])?\{schule-arbeitsblatt\}/, function (match, p1, p2) {
        // match \documentclass[angabe,querformat]{schule-arbeitsblatt}
        // p1: [angabe,querformat]
        // p2: angabe,querformat
        let args = [];
        let isSolutionSet = false;
        if (p2) {
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
    core_node_1.writeFile(tmpTexFile, texFileContent);
    const result = child_process_1.default.spawnSync('lualatex', ['--shell-escape', tmpTexFile], { cwd, encoding: 'utf-8' });
    if (result.status !== 0) {
        console.log(result.stdout);
        console.log(result.stderr);
        throw new Error('lualatex compilation failed.');
    }
    const tmpPdfFile = path_1.default.join(cwd, `${jobName}.pdf`);
    const pageCount = core_node_1.getPdfPageCount(tmpPdfFile);
    for (let index = 1; index <= pageCount; index++) {
        generateOneClozeSvg(tmpPdfFile, pageCount, index);
    }
    fs_1.default.unlinkSync(tmpTexFile);
    fs_1.default.unlinkSync(tmpPdfFile);
}
/**
 * Generate from TeX files with cloze texts SVGs for baldr.
 */
function action(filePath) {
    media_manager_1.walk(generateClozeSvg, { regex: new RegExp('.*\.tex$'), path: filePath }); // eslint-disable-line
}
module.exports = action;
