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
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
// Third party packages.
const webfont_1 = __importDefault(require("webfont"));
// Project packages.
const log = __importStar(require("@bldr/log"));
const cli_utils_1 = require("@bldr/cli-utils");
const config_1 = __importDefault(require("@bldr/config"));
const core_browser_1 = require("@bldr/core-browser");
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
    return path_1.default.join(config_1.default.localRepo, 'src', 'vue', 'components', 'icons', 'src', ...arguments);
}
function downloadIcon(url, name, newName) {
    let destName;
    if (newName != null && newName !== '') {
        destName = newName;
    }
    else {
        destName = name;
    }
    log.info('Download icon %s from %s', destName, url);
    cmd.execSync(['wget', '-O', path_1.default.join(tmpDir, `${destName}.svg`), url]);
}
function downloadIcons(iconMapping, urlTemplate) {
    cmd.startProgress();
    const iconsCount = Object.keys(iconMapping).length;
    let count = 0;
    for (const oldName in iconMapping) {
        const url = urlTemplate.replace('{icon}', oldName);
        let newName = oldName;
        const iconDef = iconMapping[oldName];
        if (typeof iconDef === 'string') {
            newName = iconDef;
        }
        else if (typeof iconDef === 'object' && iconDef.newName != null) {
            newName = iconDef.newName;
        }
        downloadIcon(url, oldName, newName);
        count++;
        cmd.updateProgress(count / iconsCount, log.format('download icon “%s”', oldName));
    }
    cmd.stopProgress();
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
            const src = path_1.default.join(srcFolder, icon);
            const dest = path_1.default.join(destFolder, icon);
            fs_1.default.copyFileSync(src, dest);
            log.info('Copy the file “%s” from the source folder “%s” to the destination folder “%s”.', icon, src, dest);
        }
    }
}
function writeFileToDest(destFileName, content) {
    const destPath = getIconPath(destFileName);
    fs_1.default.writeFileSync(destPath, content);
    log.info('Create file: %s', destPath);
}
function writeBufferFileToDest(destFileName, content) {
    if (content == null) {
        return;
    }
    const destPath = getIconPath(destFileName);
    fs_1.default.writeFileSync(destPath, content);
    log.info('Create file: %s', destPath);
}
/**
 * ```css
 * .baldr-icon_account-group::before {
 *   content: "\ea01";
 * }
 * ```
 */
function createCssFile(metadataCollection) {
    const output = [];
    const header = fs_1.default.readFileSync(getIconPath('style_header.css'), { encoding: 'utf-8' });
    output.push(header);
    for (const glyphData of metadataCollection) {
        const unicodeGlyph = glyphData.unicode[0];
        const unicode = '\\' + unicodeGlyph.charCodeAt(0).toString(16);
        const glyph = `.baldr-icon_${glyphData.name}::before {\n  content: "${unicode}";\n}\n`;
        output.push(glyph);
    }
    writeFileToDest('style.css', output.join('\n'));
}
/**
 * ```tex
 * \def\bSymbolTask{{\BaldrIconFont\char"0EA3A}}
 * ```
 */
function createTexFile(metadataCollection) {
    const output = [];
    for (const glyphData of metadataCollection) {
        const unicodeGlyph = glyphData.unicode[0];
        const unicode = unicodeGlyph.charCodeAt(0).toString(16).toUpperCase();
        const name = glyphData.name.replace(/(-[a-z])/g, (group) => group.toUpperCase().replace('-', ''));
        const glyph = `\\def\\bSymbol${core_browser_1.toTitleCase(name)}{{\\BaldrIconFont\\char"0${unicode}}}`;
        output.push(glyph);
    }
    writeFileToDest('baldr-icons-macros.tex', output.join('\n'));
}
function createJsonFile(metadataCollection) {
    const output = [];
    for (const glyphData of metadataCollection) {
        output.push(glyphData.name);
    }
    writeFileToDest('icons.json', JSON.stringify(output, null, '  '));
}
function convertIntoFontFiles(config) {
    return __awaiter(this, void 0, void 0, function* () {
        log.info(config);
        try {
            const result = yield webfont_1.default(config);
            log.info(result);
            if (result.glyphsData == null) {
                throw new Error('No glyphs data found.');
            }
            const metadataCollection = [];
            for (const glyphData of result.glyphsData) {
                const metadata = glyphData.metadata;
                metadataCollection.push(metadata);
            }
            createCssFile(metadataCollection);
            createTexFile(metadataCollection);
            createJsonFile(metadataCollection);
            writeBufferFileToDest('baldr-icons.ttf', result.ttf);
            writeBufferFileToDest('baldr-icons.woff', result.woff);
            writeBufferFileToDest('baldr-icons.woff2', result.woff2);
        }
        catch (error) {
            log.error(error);
            throw error;
        }
    });
}
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        tmpDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), path_1.default.sep));
        log.info('The SVG files of the icons are downloaded to this temporary directory: %s', tmpDir);
        downloadIcons(config_1.default.iconFont.iconMapping, config_1.default.iconFont.urlTemplate);
        copyIcons(getIconPath('icons'), tmpDir);
        yield convertIntoFontFiles({
            files: `${tmpDir}/*.svg`,
            fontName: 'baldr-icons',
            formats: ['woff', 'woff2', 'ttf'],
            fontHeight: 512,
            descent: 64
        });
    });
}
exports.default = action;
