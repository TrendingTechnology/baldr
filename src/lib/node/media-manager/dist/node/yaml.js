"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeYamlMetaData = exports.readYamlMetaData = void 0;
const fs_1 = __importDefault(require("fs"));
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const core_browser_1 = require("@bldr/core-browser");
const media_file_classes_1 = require("./media-file-classes");
const media_categories_1 = require("@bldr/media-categories");
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
    return file_reader_writer_1.readYamlFile(`${filePath}.yml`);
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
    if (fs_1.default.lstatSync(filePath).isDirectory())
        return;
    const yamlFile = `${core_browser_1.asciify(filePath)}.yml`;
    if ((force != null && force) ||
        !fs_1.default.existsSync(yamlFile)) {
        // eslint-disable-next-line
        if (metaData == null)
            metaData = {};
        const asset = new media_file_classes_1.Asset(filePath);
        if (metaData.ref == null) {
            metaData.ref = asset.basename;
        }
        if (metaData.title == null) {
            metaData.title = core_browser_1.deasciify(asset.basename);
        }
        metaData.filePath = filePath;
        metaData = media_categories_1.categoriesManagement.process(metaData);
        file_reader_writer_1.writeYamlFile(yamlFile, metaData);
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
exports.writeYamlMetaData = writeYamlMetaData;
