"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMasterExamples = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function readMasterExamples() {
    function getBaseName(filePath) {
        return filePath.replace('.baldr.yml', '');
    }
    const examples = {
        common: {},
        masters: {}
    };
    const basePath = path_1.default.join(require
        .resolve('@bldr/presentation-parser')
        .replace('/dist/main.js', ''), 'tests', 'files');
    // common
    const commonBasePath = path_1.default.join(basePath, 'common');
    for (const exampleFile of fs_1.default.readdirSync(commonBasePath)) {
        if (exampleFile.match(/\.baldr\.yml$/) != null) {
            const rawYaml = fs_1.default.readFileSync(path_1.default.join(commonBasePath, exampleFile), 'utf8');
            examples.common[getBaseName(exampleFile)] = rawYaml;
        }
    }
    // masters
    const mastersBasePath = path_1.default.join(basePath, 'masters');
    for (const masterName of fs_1.default.readdirSync(mastersBasePath)) {
        const rawYaml = fs_1.default.readFileSync(path_1.default.join(mastersBasePath, masterName), 'utf8');
        examples.masters[getBaseName(masterName)] = rawYaml;
    }
    return examples;
}
exports.readMasterExamples = readMasterExamples;
