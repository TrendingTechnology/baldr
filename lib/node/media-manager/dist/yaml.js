var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import path from 'path';
import { readYamlFile, writeYamlFile } from '@bldr/file-reader-writer';
import { asciify, deasciify, getExtension } from '@bldr/string-format';
import { categoriesManagement } from '@bldr/media-categories';
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
export function readYamlMetaData(filePath) {
    return readYamlFile(`${filePath}.yml`);
}
/**
 * Write the metadata YAML file for a corresponding media file specified
 * by `filePath`. The property names are converted to `snake_case`.
 *
 * @param filePath - The filePath gets asciified and a yml extension is
 *   appended.
 * @param metaData - The metadata to store in the YAML file.
 * @param force - Always create the yaml file. Overwrite the old one.
 */
export function writeYamlMetaData(filePath, metaData, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs.lstatSync(filePath).isDirectory()) {
            return;
        }
        const yamlFile = `${asciify(filePath)}.yml`;
        if ((force != null && force) || !fs.existsSync(yamlFile)) {
            if (metaData == null) {
                // TODO use different type
                // eslint-disable-next-line
                metaData = {};
            }
            const basename = path.basename(filePath, '.' + getExtension(filePath));
            if (metaData.ref == null) {
                metaData.ref = basename;
            }
            if (metaData.title == null) {
                metaData.title = deasciify(basename);
            }
            metaData.filePath = filePath;
            metaData = yield categoriesManagement.process(metaData);
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
    });
}
