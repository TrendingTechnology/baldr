/**
 * @module @bldr/icon-font-generator
 */
// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js
import fs from 'fs';
import path from 'path';
import { webfont } from 'webfont';
// Project packages.
import { CommandRunner } from '@bldr/cli-utils';
import { createTmpDir } from '@bldr/core-node';
import { readJsonFile, writeJsonFile } from '@bldr/file-reader-writer';
import * as log from '@bldr/log';
import { getConfig } from '@bldr/config';
const config = getConfig();
const cmd = new CommandRunner();
/**
 * For the tests. To see whats going on. The test runs very long.
 */
export const setLogLevel = log.setLogLevel;
/**
 * Download one icon.
 *
 * @param url - The URL to download a icon.
 * @param destDir - The destination directory where the icon should be stored.
 * @param oldName - The old original name of the Material Design icons project.
 * @param newName - The new name of the icon.
 */
function downloadIcon(url, destDir, oldName, newName) {
    let destName;
    if (newName != null && newName !== '') {
        destName = newName;
    }
    else {
        destName = oldName;
    }
    log.info('Download icon %s from %s', [destName, url]);
    cmd.execSync(['wget', '-O', path.join(destDir, `${destName}.svg`), url]);
}
/**
 * Download all icons.
 *
 * @param iconMapping
 * @param urlTemplate
 * @param destDir - The destination directory where the icon should be stored.
 */
function downloadIcons(iconMapping, urlTemplate, destDir) {
    cmd.startProgress();
    const iconsCount = Object.keys(iconMapping).length;
    let count = 0;
    for (const newName in iconMapping) {
        let oldName = newName;
        const iconDef = iconMapping[newName];
        if (typeof iconDef === 'string') {
            oldName = iconDef;
        }
        else if (typeof iconDef === 'object' && iconDef.oldName != null) {
            oldName = iconDef.oldName;
        }
        const url = urlTemplate.replace('{icon}', oldName);
        downloadIcon(url, destDir, oldName, newName);
        count++;
        cmd.updateProgress(count / iconsCount, log.format('download icon “%s”', [newName]));
    }
    cmd.stopProgress();
}
/**
 * Copy svg icons for a source folder to a destination folder.
 *
 * @param srcFolder - The source folder.
 * @param destFolder - The destination folder.
 */
function copyIcons(srcFolder, destFolder) {
    const icons = fs.readdirSync(srcFolder);
    for (const icon of icons) {
        if (icon.includes('.svg')) {
            const src = path.join(srcFolder, icon);
            const dest = path.join(destFolder, icon);
            fs.copyFileSync(src, dest);
            log.info('Copy the file “%s” from the source folder “%s” to the destination folder “%s”.', [
                icon,
                src,
                dest
            ]);
        }
    }
}
function writeFile(destPath, content) {
    fs.writeFileSync(destPath, content);
    log.verbose('Create file: %s', [destPath]);
}
function writeBuffer(destPath, content) {
    if (content == null) {
        return;
    }
    fs.writeFileSync(destPath, content);
    log.verbose('Create file: %s', [destPath]);
}
const cssStyleHeader = `
@font-face {
  font-family: "Baldr Icons";
  src: url("./baldr-icons.woff2") format("woff2"), url("./baldr-icons.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

.baldr-icon,
.baldr-icon::before {
  display: inline-block;
  font: normal normal normal 24px/1 "Baldr Icons";
  font-size: inherit;
  text-rendering: auto;
  line-height: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.baldr-icon-spin:before {
  animation: baldr-icon-spin 4s infinite linear;
}

@keyframes baldr-icon-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
`;
/**
 * ```css
 * .baldr-icon_account-group::before {
 *   content: "\ea01";
 * }
 * ```
 *
 * @param metadataCollection - An array of glyph metadata.
 * @param destDir - A path to a destination directory.
 */
function createCssFile(metadataCollection, destDir) {
    const output = [];
    output.push(cssStyleHeader);
    for (const glyphData of metadataCollection) {
        const unicodeGlyph = glyphData.unicode[0];
        const unicode = '\\' + unicodeGlyph.charCodeAt(0).toString(16);
        const glyph = `.baldr-icon_${glyphData.name}::before {\n  content: "${unicode}";\n}\n`;
        output.push(glyph);
    }
    writeFile(path.join(destDir, 'style.css'), output.join('\n'));
}
/**
 * @param metadataCollection - An array of glyph metadata.
 * @param destDir - A path to a destination directory.
 */
function createJsonFile(metadataCollection, destDir) {
    const output = [];
    for (const glyphData of metadataCollection) {
        output.push(glyphData.name);
    }
    writeFile(path.join(destDir, 'icons.json'), JSON.stringify(output, null, '  '));
}
async function convertIntoFontFiles(tmpDir, destDir) {
    log.infoAny(config);
    try {
        const result = await webfont({
            files: `${tmpDir}/*.svg`,
            fontName: 'baldr-icons',
            formats: ['woff', 'woff2', 'ttf'],
            fontHeight: 512,
            descent: 64
        });
        log.infoAny(result);
        if (result.glyphsData == null) {
            throw new Error('No glyphs data found.');
        }
        const metadataCollection = [];
        for (const glyphData of result.glyphsData) {
            const metadata = glyphData.metadata;
            metadataCollection.push(metadata);
        }
        createCssFile(metadataCollection, destDir);
        createJsonFile(metadataCollection, destDir);
        patchConfig(metadataCollection, destDir);
        writeBuffer(path.join(destDir, 'baldr-icons.ttf'), result.ttf);
        writeBuffer(path.join(destDir, 'baldr-icons.woff'), result.woff);
        writeBuffer(path.join(destDir, 'baldr-icons.woff2'), result.woff2);
    }
    catch (error) {
        log.errorAny(error);
        throw error;
    }
}
function patchConfig(metadataCollection, destPath) {
    // to get a fresh unpatched version
    const configJson = readJsonFile(config.configurationFileLocations[1]);
    // Don’t update the configuration file when testing.
    if (configJson.iconFont.destPath !== destPath) {
        return;
    }
    const assigment = {};
    for (const glyphData of metadataCollection) {
        assigment[glyphData.name] = glyphData.unicode[0].charCodeAt(0);
    }
    configJson.iconFont.unicodeAssignment = assigment;
    for (const filePath of config.configurationFileLocations) {
        log.info('Patch configuration file %s', [filePath]);
        writeJsonFile(filePath, configJson);
    }
}
export async function createIconFont(config, tmpDir) {
    log.info('The SVG files of the icons are downloaded to this temporary directory: %s', [tmpDir]);
    downloadIcons(config.iconFont.iconMapping, config.iconFont.urlTemplate, tmpDir);
    copyIcons(config.iconFont.additionalIconsPath, tmpDir);
    await convertIntoFontFiles(tmpDir, config.iconFont.destPath);
}
async function action() {
    await createIconFont(config, createTmpDir());
}
export default action;
