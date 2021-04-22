"use strict";
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
// Node packages.
const fs_1 = __importDefault(require("fs"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
const yaml_1 = require("@bldr/yaml");
/**
 * @param filePath - The media file path.
 */
function validateYamlOneFile(filePath) {
    try {
        yaml_1.convertFromYamlRaw(fs_1.default.readFileSync(filePath, 'utf8'));
        console.log(`${chalk_1.default.green('ok')}: ${chalk_1.default.yellow(filePath)}`);
    }
    catch (error) {
        const e = error;
        console.log(`${chalk_1.default.red('error')}: ${chalk_1.default.red(e.name)}: ${e.message}`);
        throw new Error(error.name);
    }
}
/**
 * Validate YAML files.
 *
 * @param filePaths - The media file path.
 */
function action(filePaths) {
    return __awaiter(this, void 0, void 0, function* () {
        yield media_manager_1.walk(validateYamlOneFile, {
            path: filePaths,
            regex: 'yml'
        });
    });
}
module.exports = action;
