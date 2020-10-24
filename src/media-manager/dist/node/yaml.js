"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeMetaDataYaml = exports.writeYamlFile = exports.loadYaml = exports.yamlToTxt = void 0;
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const core_browser_ts_1 = require("@bldr/core-browser-ts");
const file_1 = require("./file");
const helper_1 = require("./helper");
const media_file_classes_1 = require("./media-file-classes");
const meta_types_1 = __importDefault(require("./meta-types"));
/**
 * Convert a Javascript object into a text string, ready to be written
 * into a text file. The property names are converted to `snake_case`.
 *
 * @param data - Some data to convert to YAML.
 *
 * @returns A string in the YAML format ready to be written into a text
 *   file. The result string begins with `---`.
 */
function yamlToTxt(data) {
    data = core_browser_ts_1.convertPropertiesCamelToSnake(data);
    const yamlMarkup = [
        '---',
        js_yaml_1.default.safeDump(data, core_browser_ts_1.jsYamlConfig)
    ];
    return yamlMarkup.join('\n');
}
exports.yamlToTxt = yamlToTxt;
/**
 * Load a YAML file. Return only objects to save vscode type checks.
 *
 * @param filePath - The path of a YAML file.
 *
 * @returns The parsed YAML file as a object. The string properties are
 * in the camleCase format.
 */
function loadYaml(filePath) {
    const result = js_yaml_1.default.safeLoad(file_1.readFile(filePath));
    if (typeof result !== 'object') {
        return { result };
    }
    return core_browser_ts_1.convertPropertiesSnakeToCamel(result);
}
exports.loadYaml = loadYaml;
/**
 * Convert some data (usually Javascript objets) into the YAML format
 * and write the string into a text file.
 *
 * @param filePath - The file path of the destination yaml file. The yml
 *   extension has to be included.
 * @param data - Some data to convert into yaml and write into a text
 *   file.
 *
 * @returns The data converted to YAML as a string.
 */
function writeYamlFile(filePath, data) {
    const yaml = yamlToTxt(data);
    file_1.writeFile(filePath, yaml);
    return yaml;
}
exports.writeYamlFile = writeYamlFile;
/**
 * Write the metadata YAML file for a corresponding media file specified by
 * `filePath`.
 *
 * @param filePath - The filePath gets asciified and a yml extension
 *   is appended.
 * @param metaData
 * @param force - Always create the yaml file. Overwrite the old one.
 */
function writeMetaDataYaml(filePath, metaData, force) {
    if (fs_1.default.lstatSync(filePath).isDirectory())
        return;
    const yamlFile = `${helper_1.asciify(filePath)}.yml`;
    if (force ||
        !fs_1.default.existsSync(yamlFile)) {
        if (!metaData)
            metaData = {};
        const asset = new media_file_classes_1.Asset(filePath);
        if (!metaData.id) {
            metaData.id = asset.basename;
        }
        if (!metaData.title) {
            metaData.title = helper_1.deasciify(asset.basename);
        }
        metaData = meta_types_1.default.process(metaData);
        writeYamlFile(yamlFile, metaData);
        return {
            filePath,
            yamlFile,
            metaData
        };
    }
    return {
        filePath,
        msg: 'No action.'
    };
}
exports.writeMetaDataYaml = writeMetaDataYaml;
