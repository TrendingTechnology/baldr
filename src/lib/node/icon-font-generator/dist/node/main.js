"use strict";
/**
 * @module @bldr/icon-font-generator
 */
// https://github.com/Templarian/MaterialDesign-Font-Build/blob/master/bin/index.js
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createIconFont = exports.setLogLevel = void 0;
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Third party packages.
const webfont_1 = __importDefault(require("webfont"));
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const core_node_1 = require("@bldr/core-node");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const log = __importStar(require("@bldr/log"));
const config_1 = __importDefault(require("@bldr/config"));
const cmd = new cli_utils_1.CommandRunner();
/**
 * For the tests. To see whats going on. The test runs very long.
 */
exports.setLogLevel = log.setLogLevel;
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
    cmd.execSync(['wget', '-O', path_1.default.join(destDir, `${destName}.svg`), url]);
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
    const icons = fs_1.default.readdirSync(srcFolder);
    for (const icon of icons) {
        if (icon.includes('.svg')) {
            const src = path_1.default.join(srcFolder, icon);
            const dest = path_1.default.join(destFolder, icon);
            fs_1.default.copyFileSync(src, dest);
            log.info('Copy the file “%s” from the source folder “%s” to the destination folder “%s”.', [
                icon,
                src,
                dest
            ]);
        }
    }
}
function writeFile(destPath, content) {
    fs_1.default.writeFileSync(destPath, content);
    log.verbose('Create file: %s', [destPath]);
}
function writeBuffer(destPath, content) {
    if (content == null) {
        return;
    }
    fs_1.default.writeFileSync(destPath, content);
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
    writeFile(path_1.default.join(destDir, 'style.css'), output.join('\n'));
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
    writeFile(path_1.default.join(destDir, 'icons.json'), JSON.stringify(output, null, '  '));
}
function convertIntoFontFiles(tmpDir, destDir) {
    return __awaiter(this, void 0, void 0, function* () {
        log.infoAny(config_1.default);
        try {
            const result = yield (0, webfont_1.default)({
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
            writeBuffer(path_1.default.join(destDir, 'baldr-icons.ttf'), result.ttf);
            writeBuffer(path_1.default.join(destDir, 'baldr-icons.woff'), result.woff);
            writeBuffer(path_1.default.join(destDir, 'baldr-icons.woff2'), result.woff2);
        }
        catch (error) {
            log.errorAny(error);
            throw error;
        }
    });
}
function patchConfig(metadataCollection, destPath) {
    // to get a fresh unpatched version
    const configJson = (0, file_reader_writer_1.readJsonFile)(config_1.default.configurationFileLocations[1]);
    // Don’t update the configuration file when testing.
    if (configJson.iconFont.destPath !== destPath) {
        return;
    }
    const assigment = {};
    for (const glyphData of metadataCollection) {
        assigment[glyphData.name] = glyphData.unicode[0].charCodeAt(0);
    }
    configJson.iconFont.unicodeAssignment = assigment;
    for (const filePath of config_1.default.configurationFileLocations) {
        log.info('Patch configuration file %s', [filePath]);
        (0, file_reader_writer_1.writeJsonFile)(filePath, configJson);
    }
}
function createIconFont(config, tmpDir) {
    return __awaiter(this, void 0, void 0, function* () {
        log.info('The SVG files of the icons are downloaded to this temporary directory: %s', [tmpDir]);
        downloadIcons(config.iconFont.iconMapping, config.iconFont.urlTemplate, tmpDir);
        copyIcons(config.iconFont.additionalIconsPath, tmpDir);
        yield convertIntoFontFiles(tmpDir, config.iconFont.destPath);
    });
}
exports.createIconFont = createIconFont;
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        yield createIconFont(config_1.default, (0, core_node_1.createTmpDir)());
    });
}
exports.default = action;
