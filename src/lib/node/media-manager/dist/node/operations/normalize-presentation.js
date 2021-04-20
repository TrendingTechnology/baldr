"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePresentationFile = void 0;
const core_node_1 = require("@bldr/core-node");
const yaml_1 = require("@bldr/yaml");
const titles_1 = require("@bldr/titles");
const yaml_2 = require("../yaml");
const comment = `
#-----------------------------------------------------------------------
#
#-----------------------------------------------------------------------
`;
/**
 * Remove unnecessary single quotes.
 *
 * js-yaml add single quotes arround the media URIs, for example
 * `'id:fuer-elise'`.
 *
 * @param rawYamlString - A raw YAML string (not converted into a
 *   Javascript object).
 *
 * @returns A raw YAML string without single quotes around the media
 *   URIs.
 */
function removeSingleQuotes(rawYamlString) {
    return rawYamlString.replace(/ 'id:([^']*)'/g, ' id:$1');
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
    return rawYamlString.replace(new RegExp(`id:${presentationId}_`, 'g'), 'id:./');
}
/**
 * Normalize a presentation file.
 *
 * Remove unnecessary single quotes around media URIs.
 *
 * @param filePath - A path of a text file.
 */
function normalizePresentationFile(filePath) {
    let textContent = core_node_1.readFile(filePath);
    const presentation = yaml_2.loadYaml(filePath);
    // Generate meta.
    const title = new titles_1.DeepTitle(filePath);
    const meta = title.generatePresetationMeta();
    if (presentation.meta) {
        if (presentation.meta.id)
            meta.id = presentation.meta.id;
        if (presentation.meta.curriculumUrl)
            meta.curriculumUrl = presentation.meta.curriculumUrl;
    }
    const metaString = yaml_1.convertToYaml({ meta });
    textContent = textContent.replace(/.*\nslides:/s, metaString + comment + '\nslides:');
    // Shorten media URIs with `./`
    if (meta.id) {
        textContent = shortedMediaUris(textContent, meta.id);
    }
    // Remove single quotes.
    textContent = removeSingleQuotes(textContent);
    core_node_1.writeFile(filePath, textContent);
    console.log(textContent);
}
exports.normalizePresentationFile = normalizePresentationFile;
