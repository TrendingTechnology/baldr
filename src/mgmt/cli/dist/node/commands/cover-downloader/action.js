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
const core_node_1 = require("@bldr/core-node");
/**
 * @param {String} filePath - The media asset file path.
 */
function downloadCover(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const yamlFile = `${filePath}.yml`;
        const metaData = media_manager_1.loadYaml(yamlFile);
        console.log(metaData);
        if (metaData.coverSource == null) {
            const previewFile = `${filePath}_preview.jpg`;
            yield core_node_1.fetchFile(metaData.coverSource, previewFile);
        }
        else {
            console.log(chalk_1.default.red('No property “cover_source” found.'));
        }
    });
}
/**
 * @param files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action(files) {
    return __awaiter(this, void 0, void 0, function* () {
        yield media_manager_1.walk({
            asset(relPath) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (fs_1.default.existsSync(`${relPath}.yml`)) {
                        yield downloadCover(relPath);
                    }
                });
            }
        }, {
            path: files
        });
    });
}
module.exports = action;
