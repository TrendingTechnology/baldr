#! /usr/bin/env node
"use strict";
// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js
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
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
const webfont_1 = __importDefault(require("webfont"));
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const config_1 = __importDefault(require("@bldr/config"));
const cmd = new cli_utils_1.CommandRunner();
let tmpDir;
/**
 * Get the absolute path inside the `src/icons/src/` folder
 *
 * @param args Multiple path segents.
 *
 * @returns An absolute path.
 */
function getIconPath(...args) {
    return path_1.default.join(config_1.default.localRepo, 'src', 'icons', 'src', ...arguments);
}
function downloadIcon(url, name, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        let destName;
        if (newName) {
            destName = newName;
        }
        else {
            destName = name;
        }
        const destination = path_1.default.join(tmpDir, `${destName}.svg`);
        yield cmd.exec(['wget', '-O', destination, url]);
        // console.log(`Download destination: ${chalk.green(destination)}`)
    });
}
function downloadIcons(iconMapping, urlTemplate) {
    return __awaiter(this, void 0, void 0, function* () {
        cmd.startProgress();
        // console.log(`New download task using this template: ${chalk.red(urlTemplate)}`)
        const iconsCount = Object.keys(iconMapping).length;
        let count = 0;
        for (const oldName in iconMapping) {
            const url = urlTemplate.replace('{icon}', oldName);
            // console.log(`Download icon “${chalk.blue(icon)}” from “${chalk.yellow(url)}”`)
            let newName = oldName;
            const iconDef = iconMapping[oldName];
            if (typeof iconDef === 'string' && iconDef) {
                newName = iconDef;
            }
            else if (typeof iconDef === 'object' && iconDef.newName) {
                newName = iconDef.newName;
            }
            yield downloadIcon(url, oldName, newName);
            count++;
            cmd.updateProgress(count / iconsCount, `download icon “${chalk_1.default.blue(oldName)}”`);
        }
        cmd.stopProgress();
    });
}
/**
 * Copy svg icons for a source folder to a destination folder.
 *
 * @param srcFolder The source folder.
 * @param destFolder The destination folder.
 */
function copyIcons(srcFolder, destFolder) {
    const icons = fs_1.default.readdirSync(srcFolder);
    for (const icon of icons) {
        if (icon.includes('.svg')) {
            fs_1.default.copyFileSync(path_1.default.join(srcFolder, icon), path_1.default.join(destFolder, icon));
            console.log(`Copy the file “${chalk_1.default.magenta(icon)}” from the destination folder “${chalk_1.default.green(icon)}” to the destination folder “${chalk_1.default.yellow(icon)}”.`);
        }
    }
}
function writeFileToDest(destFileName, content) {
    const destPath = getIconPath(destFileName);
    fs_1.default.writeFileSync(destPath, content);
    console.log(`Create file: ${chalk_1.default.cyan(destPath)}`);
}
function convertIntoFontFiles(config) {
    console.log(config);
    webfont_1.default(config)
        .then((result) => {
        console.log(result);
        const css = [];
        const names = [];
        const header = fs_1.default.readFileSync(getIconPath('style_header.css'), { encoding: 'utf-8' });
        css.push(header);
        for (const glyphData of result.glyphsData) {
            const name = glyphData.metadata.name;
            names.push(name);
            const unicodeGlyph = glyphData.metadata.unicode[0];
            const cssUnicodeEscape = '\\' + unicodeGlyph.charCodeAt(0).toString(16);
            const cssGlyph = `.baldr-icon_${name}::before {
  content: "${cssUnicodeEscape}";
}
`;
            css.push(cssGlyph);
            console.log(`name: ${chalk_1.default.red(name)} unicode glyph: ${chalk_1.default.yellow(unicodeGlyph)} unicode escape hex: ${chalk_1.default.green(cssUnicodeEscape)}`);
        }
        writeFileToDest('style.css', css.join('\n'));
        writeFileToDest('baldr-icons.woff', result.woff);
        writeFileToDest('baldr-icons.woff2', result.woff2);
        writeFileToDest('icons.json', JSON.stringify(names, null, '  '));
        return result;
    })
        .catch((error) => {
        console.log(error);
        throw error;
    });
}
function buildFont(options) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const task of options) {
            if (task.urlTemplate) {
                yield downloadIcons(task.iconMapping, task.urlTemplate);
            }
            else if (task.folder) {
                copyIcons(task.folder, tmpDir);
            }
        }
        convertIntoFontFiles({
            files: `${tmpDir}/*.svg`,
            fontName: 'baldr-icons',
            formats: ['woff', 'woff2'],
            fontHeight: 512,
            descent: 64
        });
    });
}
function action() {
    tmpDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), path_1.default.sep));
    console.log(`The SVG files of the icons are download to: ${chalk_1.default.yellow(tmpDir)}`);
    buildFont([
        config_1.default.iconFont,
        {
            folder: getIconPath('icons'),
            // iconMapping not used
            iconMapping: {
                baldr: '',
                musescore: '',
                wikidata: '',
                'document-camera': '',
                // Google icon „overscan“, not downloadable via github?
                fullscreen: ''
            }
        }
    ]);
}
module.exports = action;
