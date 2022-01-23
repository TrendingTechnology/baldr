var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Bundle all operations in an object
 */
import fs from 'fs';
import { convertFromYamlRaw } from '@bldr/yaml';
import { getExtension } from '@bldr/string-format';
import * as log from '@bldr/log';
import { parseAndResolve } from '@bldr/presentation-parser';
import { readFile } from '@bldr/file-reader-writer';
import { updateMediaServer } from '@bldr/api-wrapper';
import { walk } from './directory-tree-walk';
import { patchTexTitles } from './tex';
import * as presentationOperations from './presentation';
import * as txtOperations from './txt';
import * as assetOperations from './asset';
/**
 * Indicates if the media server was updated in the current run of the program.
 */
let mediaServerUpdated = false;
function validateYamlOneFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return;
    }
    try {
        convertFromYamlRaw(fs.readFileSync(filePath, 'utf8'));
        log.debug('Valid YAML file: %s', [filePath]);
    }
    catch (error) {
        const e = error;
        log.error('Invalid YAML file %s. Error: %s: %s', [
            filePath,
            e.name,
            e.message
        ]);
        throw new Error(e.name);
    }
}
function normalizeAsset(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(filePath)) {
            return;
        }
        const yamlFile = `${filePath}.yml`;
        if (!fs.existsSync(yamlFile)) {
            yield assetOperations.initializeMetaYaml(filePath);
        }
        else {
            yield assetOperations.normalizeMediaAsset(filePath);
        }
        if (!fs.existsSync(filePath)) {
            return;
        }
        assetOperations.renameByRef(filePath);
        if (!fs.existsSync(yamlFile)) {
            return;
        }
        txtOperations.fixTypography(yamlFile);
    });
}
function normalizeEveryFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return;
    }
    const extension = getExtension(filePath);
    if (extension != null && extension === 'txt') {
        txtOperations.fixTypography(filePath);
    }
    if (filePath.match(/\.yml$/i) != null) {
        validateYamlOneFile(filePath);
    }
    else if (filePath.match(/\.svg$/i) != null) {
        txtOperations.removeWidthHeightInSvg(filePath);
    }
}
function normalizePresentation(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(filePath)) {
            return;
        }
        presentationOperations.normalizePresentationFile(filePath);
        log.verbose('Generate presentation automatically on path %s:', [filePath]);
        yield presentationOperations.generateAutomaticPresentation(filePath);
        txtOperations.fixTypography(filePath);
        if (!mediaServerUpdated) {
            yield updateMediaServer();
            mediaServerUpdated = true;
        }
        yield parseAndResolve(readFile(filePath));
        // presentation.log()
    });
}
function normalizeTex(filePath) {
    patchTexTitles(filePath);
    txtOperations.fixTypography(filePath);
}
/**
 * Execute different normalization tasks.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
export function normalize(filePaths, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        if (filePaths.length === 0) {
            filePaths = [process.cwd()];
        }
        // `baldr normalize video.mp4.yml` only validates the YAML structure. We have
        // to call `baldr normalize video.mp4` to get the full normalization of the
        // metadata file video.mp4.yml.
        if (filePaths.length === 1 &&
            filePaths[0].match(/\.yml$/) != null &&
            filePaths[0].match(/\.baldr\.yml$/) == null) {
            filePaths[0] = filePaths[0].replace(/\.yml$/, '');
        }
        let functionBundle = {};
        if (filter == null) {
            functionBundle = {
                asset: normalizeAsset,
                everyFile: normalizeEveryFile,
                presentation: normalizePresentation,
                tex: normalizeTex
            };
        }
        else if (filter === 'presentation') {
            log.info('Normalize only presentations');
            functionBundle = {
                presentation: normalizePresentation
            };
        }
        else if (filter === 'tex') {
            log.info('Normalize only TeX files');
            functionBundle = {
                tex: normalizeTex
            };
        }
        else if (filter === 'asset') {
            log.info('Normalize only assets');
            functionBundle = {
                asset: normalizeAsset
            };
        }
        yield walk(functionBundle, {
            path: filePaths
        });
    });
}
