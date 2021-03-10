"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const fs_1 = __importDefault(require("fs"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
const js_yaml_1 = __importDefault(require("js-yaml"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
/**
 * @param filePath - The media file path.
 */
function validateYamlOneFile(filePath) {
    try {
        js_yaml_1.default.load(fs_1.default.readFileSync(filePath, 'utf8'));
        console.log(`${chalk_1.default.green('ok')}: ${chalk_1.default.yellow(filePath)}`);
    }
    catch (error) {
        console.log(`${chalk_1.default.red('error')}: ${chalk_1.default.red(error.name)}: ${error.message}`);
        throw new Error(error.name);
    }
}
/**
 * Validate YAML files.
 *
 * @param filePaths - The media file path.
 */
function action(filePaths) {
    media_manager_1.walk(validateYamlOneFile, {
        path: filePaths,
        regex: 'yml'
    });
}
module.exports = action;
