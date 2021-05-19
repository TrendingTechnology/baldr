"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePresentationFile = void 0;
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const core_browser_1 = require("@bldr/core-browser");
const yaml_1 = require("@bldr/yaml");
const titles_1 = require("@bldr/titles");
const file_reader_writer_2 = require("@bldr/file-reader-writer");
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
function normalizePresentationFile(filePath) {
    var _a, _b, _c;
    let textContent = file_reader_writer_1.readFile(filePath);
    const presentation = file_reader_writer_2.readYamlFile(filePath);
    // Generate meta.
    const title = new titles_1.DeepTitle(filePath);
    const meta = title.generatePresetationMeta();
    if (((_a = presentation === null || presentation === void 0 ? void 0 : presentation.meta) === null || _a === void 0 ? void 0 : _a.ref) != null) {
        meta.ref = presentation.meta.ref;
    }
    if (((_b = presentation === null || presentation === void 0 ? void 0 : presentation.meta) === null || _b === void 0 ? void 0 : _b.curriculumUrl) != null) {
        meta.curriculumUrl = presentation.meta.curriculumUrl;
    }
    if (((_c = presentation === null || presentation === void 0 ? void 0 : presentation.meta) === null || _c === void 0 ? void 0 : _c.uuid) == null) {
        meta.uuid = core_browser_1.genUuid();
    }
    else {
        meta.uuid = presentation.meta.uuid;
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const metaSorted = {};
    metaSorted.ref = meta.ref;
    if (meta.uuid != null)
        metaSorted.uuid = meta.uuid;
    metaSorted.title = meta.title;
    metaSorted.subtitle = meta.subtitle;
    metaSorted.grade = meta.grade;
    metaSorted.curriculum = meta.curriculum;
    if (meta.curriculumUrl != null)
        metaSorted.curriculumUrl = meta.curriculumUrl;
    const metaString = yaml_1.convertToYaml({ meta: metaSorted });
    textContent = textContent.replace(/.*\nslides:/s, metaString + comment + '\nslides:');
    // Shorten media URIs with `./`
    if (meta.ref != null) {
        textContent = shortedMediaUris(textContent, meta.ref);
    }
    // Remove single quotes.
    textContent = removeSingleQuotes(textContent);
    file_reader_writer_1.writeFile(filePath, textContent);
    return textContent;
}
exports.normalizePresentationFile = normalizePresentationFile;
