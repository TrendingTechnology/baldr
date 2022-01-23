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
// Project packages.
import { objectifyTexItemize, objectifyTexZitat } from '@bldr/tex-markdown-converter';
import { convertFromYaml, convertToYaml } from '@bldr/yaml';
import { readFile, writeFile, readYamlFile } from '@bldr/file-reader-writer';
import { generateUuid } from '@bldr/uuid';
import { DeepTitle } from '@bldr/titles';
import * as log from '@bldr/log';
import { buildDbAssetData } from '@bldr/media-data-collector';
import { walk } from './directory-tree-walk';
import { locationIndicator } from './location-indicator';
import { logFileDiff } from './asset';
const comment = `
#-----------------------------------------------------------------------
#
#-----------------------------------------------------------------------
`;
/**
 * Remove unnecessary single quotes.
 *
 * js-yaml add single quotes arround the media URIs, for example
 * `'ref:fuer-elise'`.
 *
 * @param rawYamlString - A raw YAML string (not converted into a
 *   Javascript object).
 *
 * @returns A raw YAML string without single quotes around the media
 *   URIs.
 */
function removeSingleQuotes(rawYamlString) {
    return rawYamlString.replace(/ 'ref:([^']*)'/g, ' ref:$1');
}
/**
 * Shorten all media URIs in a presentation file.
 *
 * The presentation is not converted into YAML. This function operates
 * by replacing text substrings.
 *
 * @param rawYamlString - A raw YAML string (not converted into a
 *   Javascript object).
 * @param presentationId - The ID of a presentation.
 *
 * @returns A raw YAML string without single quotes around the media
 *   URIs.
 */
function shortedMediaUris(rawYamlString, presentationId) {
    return rawYamlString.replace(new RegExp(`ref:${presentationId}_`, 'g'), 'ref:./');
}
/**
 * Normalize a presentation file.
 *
 * Remove unnecessary single quotes around media URIs.
 *
 * @param filePath - A path of a text file.
 */
export function normalizePresentationFile(filePath, oldTextContent) {
    var _a, _b, _c, _d;
    let textContent = readFile(filePath);
    const intermediateTextContent = textContent;
    if (oldTextContent == null) {
        oldTextContent = textContent;
    }
    const oldPresentation = convertFromYaml(oldTextContent);
    const presentation = readYamlFile(filePath);
    // Generate meta.
    const title = new DeepTitle(filePath);
    const meta = title.generatePresetationMeta();
    if (((_a = presentation === null || presentation === void 0 ? void 0 : presentation.meta) === null || _a === void 0 ? void 0 : _a.ref) != null) {
        meta.ref = presentation.meta.ref;
    }
    if (((_b = presentation === null || presentation === void 0 ? void 0 : presentation.meta) === null || _b === void 0 ? void 0 : _b.curriculumUrl) != null) {
        meta.curriculumUrl = presentation.meta.curriculumUrl;
    }
    if (((_c = oldPresentation.meta) === null || _c === void 0 ? void 0 : _c.uuid) != null) {
        meta.uuid = oldPresentation.meta.uuid;
    }
    else if (((_d = presentation === null || presentation === void 0 ? void 0 : presentation.meta) === null || _d === void 0 ? void 0 : _d.uuid) == null) {
        meta.uuid = generateUuid();
    }
    else {
        meta.uuid = presentation.meta.uuid;
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const metaSorted = {};
    metaSorted.ref = meta.ref;
    if (meta.uuid != null) {
        metaSorted.uuid = meta.uuid;
    }
    metaSorted.title = meta.title;
    metaSorted.subtitle = meta.subtitle;
    metaSorted.subject = meta.subject;
    metaSorted.grade = meta.grade;
    metaSorted.curriculum = meta.curriculum;
    if (meta.curriculumUrl != null) {
        metaSorted.curriculumUrl = meta.curriculumUrl;
    }
    const metaString = convertToYaml({ meta: metaSorted });
    textContent = textContent.replace(/.*\nslides:/s, metaString + comment + '\nslides:');
    // Shorten media URIs with `./`
    if (meta.ref != null) {
        textContent = shortedMediaUris(textContent, meta.ref);
    }
    textContent = removeSingleQuotes(textContent);
    // Remove single quotes.
    if (intermediateTextContent !== textContent) {
        if (oldTextContent !== textContent) {
            logFileDiff(filePath, oldTextContent, textContent);
        }
        writeFile(filePath, textContent);
    }
    else {
        log.verbose('No changes after normalization of the presentation %s', [
            filePath
        ]);
    }
}
function slidify(masterName, data, topLevelData) {
    function slidifySingle(masterName, data) {
        const slide = {};
        slide[masterName] = data;
        if (topLevelData != null)
            Object.assign(slide, topLevelData);
        return slide;
    }
    if (Array.isArray(data)) {
        const result = [];
        for (const item of data) {
            result.push(slidifySingle(masterName, item));
        }
        return result;
    }
    else {
        return [slidifySingle(masterName, data)];
    }
}
/**
 * Create a presentation file and insert all media assets in
 * the presentation.
 *
 * @param filePath - The file path of the new created presentation
 *   template.
 */
function generatePresentation(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const basePath = path.dirname(filePath);
        let slides = [];
        yield walk({
            asset(relPath) {
                let asset;
                if (fs.existsSync(`${relPath}.yml`)) {
                    asset = buildDbAssetData(relPath);
                }
                if (asset == null || asset.ref == null) {
                    return;
                }
                let masterName = 'generic';
                if (asset.ref.includes('_LT')) {
                    masterName = 'cloze';
                }
                else if (asset.ref.includes('NB')) {
                    masterName = 'score_sample';
                }
                else if (asset.mimeType != null) {
                    masterName = asset.mimeType;
                }
                const slideData = {
                    [masterName]: `ref:${asset.ref}`
                };
                slides.push(slideData);
            }
        }, { path: basePath, maxDepths: 1 });
        const notePath = path.join(basePath, 'Hefteintrag.tex');
        if (fs.existsSync(notePath)) {
            const noteContent = readFile(notePath);
            slides = slides.concat(slidify('note', objectifyTexItemize(noteContent), {
                source: 'Hefteintrag.tex'
            }));
        }
        const worksheetPath = path.join(basePath, 'Arbeitsblatt.tex');
        if (fs.existsSync(worksheetPath)) {
            const worksheetContent = readFile(worksheetPath);
            slides = slides.concat(slidify('quote', objectifyTexZitat(worksheetContent), {
                source: 'Arbeitsblatt.tex'
            }));
        }
        log.verbose('Write automatically generated presentation file to path %s', [
            filePath
        ]);
        const result = convertToYaml({
            slides
        });
        log.debug(result);
        writeFile(filePath, result);
    });
}
/**
 * Create a automatically generated presentation file.
 */
export function generateAutomaticPresentation(filePath, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if (filePath == null) {
            filePath = process.cwd();
        }
        else {
            const stat = fs.statSync(filePath);
            if (!stat.isDirectory()) {
                filePath = path.dirname(filePath);
            }
        }
        filePath = locationIndicator.getTwoDigitPrefixedParentDir(filePath);
        if (filePath == null) {
            log.warn('You are not in a presentation folder prefixed with two digits!');
            return;
        }
        filePath = path.resolve(path.join(filePath, 'Praesentation.baldr.yml'));
        if (!fs.existsSync(filePath) || (force != null && force)) {
            log.info('Presentation template created at: %s', [filePath]);
        }
        else {
            const rawPresentation = readYamlFile(filePath);
            log.verboseAny(rawPresentation);
            if ((rawPresentation === null || rawPresentation === void 0 ? void 0 : rawPresentation.slides) != null) {
                filePath = filePath.replace('.baldr.yml', '_automatic.baldr.yml');
                log.verbose('Presentation already exists, create tmp file: %s', [
                    log.colorize.red(filePath)
                ]);
            }
            else {
                log.info('Overwrite the presentation as it has no slides: %s', [
                    log.colorize.red(filePath)
                ]);
            }
        }
        let oldTextContent;
        if (fs.existsSync(filePath)) {
            oldTextContent = readFile(filePath);
        }
        yield generatePresentation(filePath);
        normalizePresentationFile(filePath, oldTextContent);
    });
}
