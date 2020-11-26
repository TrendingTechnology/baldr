"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const yaml_1 = require("@bldr/yaml");
const slide_1 = require("./slide");
const presentation_1 = require("./presentation");
/**
 * Parse the slide objects in a recursive fashion. Child slides can be specified
 * under the `slides` property.
 *
 * @param slidesRaw - The raw slide array from the YAML presentation
 *  file, the slides property.
 * @param slidesFlat - A array which is filled with every slide object.
 * @param slidesTree - A array which is filled with only top level slide
 *   objects.
 * @param level - The level in the hierachial tree the slide lies in 1:
 *   Main level, 2: First child level ...
 */
function parseSlidesRecursive(slidesRaw, slidesFlat, slidesTree, level = 1) {
    for (const slideRaw of slidesRaw) {
        if (slideRaw.state !== 'absent') {
            const childSlides = slideRaw.slides;
            delete slideRaw.slides;
            const slide = new slide_1.Slide(slideRaw);
            slidesFlat.push(slide);
            slidesTree.push(slide);
            slide.no = slidesFlat.length;
            slide.level = level;
            if (childSlides && Array.isArray(childSlides)) {
                parseSlidesRecursive(childSlides, slidesFlat, slide.slides, level + 1);
            }
        }
    }
}
/**
 * Parse the YAML file `Praesentation.baldr.yml`.
 *
 * @property rawYamlString - The raw YAML string of the YAML file
 *   `Praesentation.baldr.yml`
 */
function parse(rawYamlString) {
    const rawPresentationData = yaml_1.convertFromYaml(rawYamlString);
    const slides = [];
    const slidesTree = [];
    parseSlidesRecursive(rawPresentationData.slides, slides, slidesTree);
    const presentation = new presentation_1.Presentation(slides, slidesTree);
    return presentation;
}
exports.parse = parse;
