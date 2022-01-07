"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeYamlFile = exports.readYamlFile = void 0;
const yaml_1 = require("@bldr/yaml");
const txt_1 = require("./txt");
/**
 * Load a YAML file and convert it into a Javascript object. The string
 * properties are converted into the `camleCase` format.
 *
 * @param filePath - The path of a YAML file itself.
 *
 * @returns The parsed YAML file as an object. The string properties are
 * converted into the `camleCase` format.
 */
function readYamlFile(filePath) {
    return (0, yaml_1.convertFromYaml)((0, txt_1.readFile)(filePath));
}
exports.readYamlFile = readYamlFile;
/**
 * Convert some data (usually Javascript objets) into the YAML format
 * and write the string into a text file. The property names are
 * converted to `snake_case`.
 *
 * @param filePath - The file path of the destination yaml file. The yml
 *   extension has to be included.
 * @param data - Some data to convert into yaml and write into a text
 *   file.
 *
 * @returns The data converted to YAML as a string.
 */
function writeYamlFile(filePath, data) {
    const yaml = (0, yaml_1.convertToYaml)(data);
    (0, txt_1.writeFile)(filePath, yaml);
    return yaml;
}
exports.writeYamlFile = writeYamlFile;
