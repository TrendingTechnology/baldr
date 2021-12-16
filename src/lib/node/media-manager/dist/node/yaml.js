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
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeYamlMetaData = exports.readYamlMetaData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const core_browser_1 = require("@bldr/core-browser");
const media_categories_1 = require("@bldr/media-categories");
const string_format_1 = require("@bldr/string-format");
/**
 * Load the metadata file in the YAML format of a media asset. This
 * function appends `.yml` on the file path. It is a small wrapper
 * around `readYamlFile`.
 *
 * @param filePath - The path of a media asset without the `yml`
 * extension. For example `Fuer-Elise.mp3` not `Fuer-Elise.mp3.yml`.
 *
 * @returns The parsed YAML file as an object. The string properties are
 * converted in the `camleCase` format.
 */
function readYamlMetaData(filePath) {
    return (0, file_reader_writer_1.readYamlFile)(`${filePath}.yml`);
}
exports.readYamlMetaData = readYamlMetaData;
/**
 * Write the metadata YAML file for a corresponding media file specified
 * by `filePath`. The property names are converted to `snake_case`.
 *
 * @param filePath - The filePath gets asciified and a yml extension is
 *   appended.
 * @param metaData - The metadata to store in the YAML file.
 * @param force - Always create the yaml file. Overwrite the old one.
 */
function writeYamlMetaData(filePath, metaData, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs_1.default.lstatSync(filePath).isDirectory()) {
            return;
        }
        const yamlFile = `${(0, core_browser_1.asciify)(filePath)}.yml`;
        if ((force != null && force) || !fs_1.default.existsSync(yamlFile)) {
            if (metaData == null) {
                // TODO use different type
                // eslint-disable-next-line
                metaData = {};
            }
            const basename = path_1.default.basename(filePath, '.' + (0, string_format_1.getExtension)(filePath));
            if (metaData.ref == null) {
                metaData.ref = basename;
            }
            if (metaData.title == null) {
                metaData.title = (0, core_browser_1.deasciify)(basename);
            }
            metaData.filePath = filePath;
            metaData = yield media_categories_1.categoriesManagement.process(metaData);
            (0, file_reader_writer_1.writeYamlFile)(yamlFile, metaData);
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
    });
}
exports.writeYamlMetaData = writeYamlMetaData;
