#! /usr/bin/env node
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
// Node packages.
const fs = require('fs');
const path = require('path');
const os = require('os');
// Third party packages.
const chalk = require('chalk');
const webfont = require('webfont').default;
// Project packages.
const { CommandRunner } = require('@bldr/cli-utils');
const cmd = new CommandRunner();
// Globals
const { config } = require('../../main.js');
let tmpDir;
function basePath() {
    return path.join(config.localRepo, 'src', 'icons', 'src', ...arguments);
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
        const destination = path.join(tmpDir, `${destName}.svg`);
        yield cmd.exec(['wget', '-O', destination, url]);
        // console.log(`Download destination: ${chalk.green(destination)}`)
    });
}
function downloadIcons(iconMapping, urlTemplate) {
    return __awaiter(this, void 0, void 0, function* () {
        cmd.startProgress();
        //console.log(`New download task using this template: ${chalk.red(urlTemplate)}`)
        const iconsCount = Object.keys(iconMapping).length;
        let count = 0;
        for (const icon in iconMapping) {
            const url = urlTemplate.replace('{icon}', icon);
            //console.log(`Download icon “${chalk.blue(icon)}” from “${chalk.yellow(url)}”`)
            let newName;
            if (iconMapping[icon]) {
                newName = iconMapping[icon];
            }
            yield downloadIcon(url, icon, newName);
            count++;
            cmd.updateProgress(count / iconsCount, `download icon “${chalk.blue(icon)}”`);
        }
        cmd.stopProgress();
    });
}
function copyIcons(srcFolder, destFolder) {
    const icons = fs.readdirSync(srcFolder);
    for (const icon of icons) {
        if (icons.includes('.svg') > -1) {
            fs.copyFileSync(path.join(srcFolder, icon), path.join(destFolder, icon));
            console.log(`Copy the file “${chalk.magenta(icon)}” from the destination folder “${chalk.green(icon)}” to the destination folder “${chalk.yellow(icon)}”.`);
        }
    }
}
function writeFileToDest(destFileName, content) {
    const destPath = basePath(destFileName);
    fs.writeFileSync(destPath, content);
    console.log(`Create file: ${chalk.cyan(destPath)}`);
}
function convertIntoFontFiles(config) {
    console.log(config);
    webfont(config)
        .then(result => {
        console.log(result);
        const css = [];
        const names = [];
        const header = fs.readFileSync(basePath('style_header.css'), { encoding: 'utf-8' });
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
            console.log(`name: ${chalk.red(name)} unicode glyph: ${chalk.yellow(unicodeGlyph)} unicode escape hex: ${chalk.green(cssUnicodeEscape)}`);
        }
        writeFileToDest('style.css', css.join('\n'));
        writeFileToDest('baldr-icons.woff', result.woff);
        writeFileToDest('baldr-icons.woff2', result.woff2);
        writeFileToDest('icons.json', JSON.stringify(names, null, '  '));
        return result;
    })
        .catch(error => {
        console.log(error);
        throw error;
    });
}
function buildFont(options) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const task of options) {
            if ('urlTemplate' in task) {
                yield downloadIcons(task.iconMapping, task.urlTemplate);
            }
            else if ('folder' in task) {
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
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), path.sep));
    console.log(`The SVG files of the icons are download to: ${chalk.yellow(tmpDir)}`);
    buildFont([
        {
            urlTemplate: 'https://raw.githubusercontent.com/Templarian/MaterialDesign/master/svg/{icon}.svg',
            iconMapping: {
                'account-group': '',
                'account-plus': '',
                'account-star-outline': 'account-star',
                'air-filter': '',
                'arrow-left': '',
                'chevron-down': '',
                'chevron-left': '',
                'chevron-right': '',
                'chevron-up': '',
                'content-save': 'save',
                'dice-multiple': '',
                'file-image': '',
                'file-music': 'file-audio',
                'file-outline': '',
                'file-video': '',
                'google-spreadsheet': '',
                'open-in-new': '',
                'presentation-play': 'presentation',
                'seat-outline': '',
                'table-of-contents': '',
                'test-tube': '',
                'timeline-text': '',
                'unfold-more-horizontal': 'steps',
                'unfold-more-vertical': 'slides',
                'video-switch': '',
                'window-open': '',
                close: '',
                cloud: '',
                delete: '',
                export: '',
                import: '',
                'magnify': '',
                notebook: '',
                wikipedia: '',
                'account-hard-hat': 'worker',
                youtube: '',
                play: '',
                pause: '',
                'skip-next': '',
                'skip-previous': '',
                pencil: '',
                'video-vintage': '',
                'comment-quote': '',
                'clipboard-account': '',
                'file-presentation-box': '',
                'image': '',
                music: '',
                'folder-open': '',
                'comment-alert': '',
                'comment-question': '',
                update: '',
                'play-speed': '',
                'file-tree': '',
                trumpet: '',
                'text-box-multiple-outline': 'multi-part',
                'cloud-download': '' // Master slide youtube for download (cached) video file with an asset.
            }
        },
        {
            folder: basePath('icons'),
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
