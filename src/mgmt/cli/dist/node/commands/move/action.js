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
// Third party packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = __importDefault(require("child_process"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const core_browser_1 = require("@bldr/core-browser");
const media_manager_1 = require("@bldr/media-manager");
const media_categories_1 = require("@bldr/media-categories");
const core_node_1 = require("@bldr/core-node");
const core_browser_2 = require("@bldr/core-browser");
/**
 * Relocate a media asset inside the main media folder. Move some
 * media assets into two letter folders.
 *
 * @param {String} oldPath
 * @param {String} extension
 */
function relocate(oldPath, extension, cmdObj) {
    if (oldPath.match(new RegExp('^.*/[A-Z]{2,}/[^/]*$')) != null) {
        return;
    }
    let twoLetterFolder = '';
    if (oldPath.match(/.*Arbeitsblatt_Loesung.*/) != null) {
        twoLetterFolder = 'TX';
    }
    else if (extension === 'jpg') {
        twoLetterFolder = 'BD';
    }
    else if (extension === 'mp4') {
        twoLetterFolder = 'VD';
    }
    else if (['svg', 'eps', 'png', 'mscx'].includes(extension)) {
        twoLetterFolder = 'NB';
    }
    else if (extension === 'm4a') {
        twoLetterFolder = 'HB';
    }
    else if (extension === 'tex') {
        twoLetterFolder = 'TX';
    }
    const parentDir = media_manager_1.locationIndicator.getPresParentDir(oldPath);
    const newPath = path_1.default.join(parentDir, twoLetterFolder, path_1.default.basename(oldPath));
    if (oldPath !== newPath) {
        if (extension === 'tex') {
            const oldContent = core_node_1.readFile(oldPath);
            // \grafik{HB/Beethoven.jpg} -> \grafik{../HB/Beethoven.jpg}
            const newContent = oldContent.replace(/\{([A-Z]{2,})\//g, '{../$1/');
            if (oldContent !== newContent) {
                core_node_1.writeFile(oldPath, newContent);
            }
        }
        media_manager_1.moveAsset(oldPath, newPath, cmdObj);
    }
}
/**
 * For images in the TeX file which appear multiple times in one file.
 */
const resolvedTexImages = {};
/**
 * Move images which are linked in a Tex file.
 *
 * @param oldPathTex - for example:
 *   `/media/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param baseName - for example: `My-little-Annie-so-sweet`
 * @param cmdObj - See commander docs.
 *
 * @returns for example: BD/John-Coltrane.jpg
 */
function moveTexImage(oldPathTex, baseName, cmdObj) {
    if (resolvedTexImages[baseName])
        return resolvedTexImages[baseName];
    // /archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Material
    const imageFolder = path_1.default.join(path_1.default.dirname(oldPathTex), 'Material');
    let ext;
    let oldPath;
    for (const extension of ['jpg', 'png', 'eps']) {
        const imagePath = path_1.default.join(imageFolder, `${baseName}.${extension}`);
        if (fs_1.default.existsSync(imagePath)) {
            oldPath = imagePath;
            ext = extension;
            break;
        }
    }
    // /archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Material/John-Coltrane.jpg
    if (oldPath) {
        // /archive/10/10_Jazz/30_Stile/50_Modern-Jazz
        const presParentDir = media_manager_1.locationIndicator.getPresParentDir(oldPath);
        // /baldr/media/10/10_Jazz/30_Stile/50_Modern-Jazz
        const presParentDirMirrored = media_manager_1.locationIndicator.getMirroredPath(presParentDir);
        if (presParentDirMirrored === undefined)
            return;
        let imgParentDir;
        if (ext === 'png' || ext === 'eps') {
            imgParentDir = 'NB';
        }
        else {
            imgParentDir = 'BD';
        }
        // BD/John-Coltrane.jpg
        const newRelPath = path_1.default.join(imgParentDir, path_1.default.basename(oldPath));
        // /baldr/media/10/10_Jazz/30_Stile/50_Modern-Jazz/BD/John-Coltrane.jpg
        const newPath = path_1.default.join(presParentDirMirrored, newRelPath);
        media_manager_1.moveAsset(oldPath, newPath, cmdObj);
        resolvedTexImages[baseName] = newRelPath;
        return newRelPath;
    }
}
/**
 *
 * @param {String} oldPath - for example:
 *   `/archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param {Object} cmdObj - See commander docs.
 */
function moveTex(oldPath, newPath, cmdObj) {
    // /archive/10/10_Jazz/30_Stile/10_New-Orleans-Dixieland/Material/Texte.tex
    // /archive/10/10_Jazz/History-of-Jazz/Inhalt.tex
    if (media_manager_1.locationIndicator.isInDeactivatedDir(oldPath))
        return;
    const content = core_node_1.readFile(oldPath);
    // \begin{grafikumlauf}{Inserat}
    // \grafik[0.8\linewidth]{Freight-Train-Blues}
    const matches = content.matchAll(/(\\grafik|\\begin\{grafikumlauf\}).*?\{(.+?)\}/g);
    // [
    //   [
    //     '\grafik[0.8\linewidth]{Freight-Train-Blues}',
    //     '\grafik[0.8\linewidth]{BD/Freight-Train-Blues.eps}'
    //   ]
    // ]
    const replacements = [];
    for (const match of matches) {
        // \grafik[0.8\linewidth]{Freight-Train-Blues}
        // \grafik{My-little-Annie-so-sweet}
        const oldMarkup = match[0];
        // Freight-Train-Blues
        // My-little-Annie-so-sweet
        const oldRelPath = match[2];
        // BD/Count-Basie.jpg
        // NB/Sing-Sing-Sing_Partitur.png
        const newRelPath = moveTexImage(oldPath, oldRelPath, cmdObj);
        // TeX files are now in the TX subfolder
        // \grafik[0.8\linewidth]{../BD/Freight-Train-Blues.eps}
        const newMarkup = oldMarkup.replace(oldRelPath, `../${newRelPath}`);
        replacements.push([oldMarkup, newMarkup]);
    }
    // /var/data/baldr/media/10/10_Jazz/30_Stile/50_Modern-Jazz/TX/Arbeitsblatt.tex
    newPath = media_manager_1.locationIndicator.moveIntoSubdir(newPath, 'TX');
    media_manager_1.moveAsset(oldPath, newPath, cmdObj);
    // Maybe --dry-run is specified
    if (fs_1.default.existsSync(newPath)) {
        let newContent = core_node_1.readFile(newPath);
        for (const replacement of replacements) {
            newContent = newContent.replace(replacement[0], replacement[1]);
        }
        core_node_1.writeFile(newPath, newContent);
    }
}
function getMbrainzRecordingId(filePath) {
    const process = child_process_1.default.spawnSync('/usr/local/bin/musicbrainz-acoustid.py', [filePath], { encoding: 'utf-8' });
    if (process.stdout) {
        // There are mulitple recording ids:
        // 0585ec4a-487d-4944-bf59-dd9ecc325c66\n
        // 065bda42-e077-4cf0-b458-4c0e455f09fe\n
        const musicbrainzRecordingId = process.stdout.replace(/\n.*$/s, '');
        console.log(chalk_1.default.red(musicbrainzRecordingId));
        return musicbrainzRecordingId;
    }
}
function moveMp3(oldPath, newPath, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        // Format dest file path.
        newPath = media_manager_1.locationIndicator.moveIntoSubdir(newPath, 'HB');
        newPath = core_browser_2.asciify(newPath);
        // a Earth, Wind & Fire - Shining Star.mp3
        let fileName = path_1.default.basename(newPath);
        fileName = fileName.replace(/\.mp3$/i, '');
        fileName = core_browser_2.idify(fileName);
        fileName = `${fileName}.mp3`;
        // a-Fletcher-Henderson_Aint-she-sweet.mp3
        fileName = fileName.replace(/^a-/, '');
        const tmpMp3Path = path_1.default.join(path_1.default.dirname(newPath), fileName);
        // Move mp3 into media.
        media_manager_1.moveAsset(oldPath, tmpMp3Path, { copy: true });
        // Convert into m4a.
        const convertedPath = yield media_manager_1.operations.convertAsset(tmpMp3Path);
        if (!convertedPath)
            throw new Error('Error converting asset.');
        let metaData = media_manager_1.readAssetYaml(convertedPath);
        if (!metaData)
            throw new Error('Error reading asset yaml');
        metaData.metaType = 'composition';
        // Try to get the MusicBrainz recording ID.
        const musicbrainzRecordingId = getMbrainzRecordingId(tmpMp3Path);
        if (musicbrainzRecordingId)
            metaData.musicbrainzRecordingId = musicbrainzRecordingId;
        metaData.source = oldPath;
        // To get ID prefix
        metaData.filePath = newPath;
        metaData = media_categories_1.categoriesManagement.process(metaData);
        media_manager_1.writeYamlFile(`${newPath}.yml`, metaData);
        // Delete MP3.
        fs_1.default.unlinkSync(tmpMp3Path);
    });
}
/**
 * @param oldPath - for example:
 *   `/archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param cmdObj - See commander docs.
 */
function moveReference(oldPath, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        let newPath = media_manager_1.locationIndicator.getMirroredPath(oldPath);
        if (newPath === undefined)
            return;
        newPath = media_manager_1.locationIndicator.moveIntoSubdir(newPath, 'QL');
        media_manager_1.moveAsset(oldPath, newPath, cmdObj);
        if (cmdObj.dryRun)
            return;
        yield media_manager_1.operations.initializeMetaYaml(newPath);
        const metaData = media_manager_1.readAssetYaml(newPath);
        if (metaData == null)
            return;
        metaData.reference_title = 'Tonart: Musik erleben - reflektieren - interpretieren; Lehrwerk für die Oberstufe.';
        metaData.author = 'Wieland Schmid';
        metaData.publisher = 'Helbling';
        metaData.release_data = 2009;
        metaData.edition = 1;
        metaData.isbn = '978-3-85061-460-3';
        media_manager_1.writeYamlFile(`${newPath}.yml`, metaData);
    });
}
/**
 * @param oldPath - for example:
 *   `/archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param extension - The extension of the file.
 * @param cmdObj - See commander docs.
 */
function moveFromArchive(oldPath, extension, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        if (oldPath.includes('Tonart.pdf')) {
            yield moveReference(oldPath, cmdObj);
            return;
        }
        if (media_manager_1.locationIndicator.isInDeactivatedDir(oldPath))
            return;
        const newPath = media_manager_1.locationIndicator.getMirroredPath(oldPath);
        if (newPath === undefined)
            return;
        console.log(`${chalk_1.default.yellow(oldPath)} -> ${chalk_1.default.green(newPath)}`);
        if (extension === 'tex') {
            moveTex(oldPath, newPath, cmdObj);
        }
        else if (extension === 'mp3') {
            moveMp3(oldPath, newPath, cmdObj);
        }
        else {
            media_manager_1.moveAsset(oldPath, newPath, cmdObj);
        }
    });
}
/**
 * @param oldPath - for example:
 *   `/archive/10/10_Jazz/30_Stile/50_Modern-Jazz/Arbeitsblatt.tex`
 * @param cmdObj - See commander docs.
 */
function move(oldPath, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        // Had to be an absolute path (to check if its an inactive/archived folder)
        oldPath = path_1.default.resolve(oldPath);
        const extension = core_browser_1.getExtension(oldPath);
        if (!extension)
            return;
        if (!media_manager_1.locationIndicator.isInArchive(oldPath)) {
            relocate(oldPath, extension, cmdObj);
        }
        else {
            yield moveFromArchive(oldPath, extension, cmdObj);
        }
    });
}
/**
 * Normalize the metadata files in the YAML format (sort, clean up).
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(filePaths, cmdObj) {
    const opts = {
        path: filePaths,
        payload: cmdObj
    };
    if (cmdObj.extension) {
        opts.regex = cmdObj.extension;
        media_manager_1.walk(move, opts);
    }
    else if (cmdObj.regexp) {
        opts.regex = new RegExp(cmdObj.regexp);
        media_manager_1.walk(move, opts);
    }
    else {
        media_manager_1.walk({
            everyFile(relPath) {
                move(relPath, {});
            }
        }, opts);
    }
}
module.exports = action;
