"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presentation = void 0;
const yaml_1 = require("@bldr/yaml");
const core_browser_1 = require("@bldr/core-browser");
const slide_1 = require("./slide");
class Meta {
    constructor(data) {
        const raw = new core_browser_1.RawDataObject(data);
        this.ref = raw.cut('ref');
        this.title = raw.cut('title');
        this.subtitle = raw.cut('subtitle');
        this.grade = raw.cut('grade');
        this.curriculum = raw.cut('curriculum');
        this.curriculumUrl = raw.cut('curriculumUrl');
        raw.throwExecptionIfNotEmpty();
    }
}
class Presentation {
    /**
     * Parse the YAML file `Praesentation.baldr.yml`.
     *
     * @property rawYamlString - The raw YAML string of the YAML file
     *   `Praesentation.baldr.yml`
     */
    constructor(rawYamlString) {
        const rawPresentationData = (0, yaml_1.convertFromYaml)(rawYamlString);
        this.meta = new Meta(rawPresentationData.meta);
        this.slides = [];
        this.slidesTree = [];
        Presentation.parseSlidesRecursive(rawPresentationData.slides, this.slides, this.slidesTree);
    }
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
    static parseSlidesRecursive(slidesRaw, slidesFlat, slidesTree, level = 1) {
        for (const slideRaw of slidesRaw) {
            if (slideRaw.state !== 'absent') {
                const childSlides = slideRaw.slides;
                delete slideRaw.slides;
                const slide = new slide_1.Slide(slideRaw);
                slidesFlat.push(slide);
                slidesTree.push(slide);
                slide.no = slidesFlat.length;
                slide.level = level;
                if (childSlides != null && Array.isArray(childSlides)) {
                    Presentation.parseSlidesRecursive(childSlides, slidesFlat, slide.slides, level + 1);
                }
            }
        }
    }
    get ref() {
        return this.meta.ref;
    }
}
exports.Presentation = Presentation;
