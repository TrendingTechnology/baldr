"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presentation = void 0;
const yaml_1 = require("@bldr/yaml");
const data_management_1 = require("./data-management");
const slide_collection_1 = require("./slide-collection");
/**
 * @inheritdoc
 */
class Meta {
    constructor(raw) {
        const data = new data_management_1.DataCutter(raw);
        this.ref = data.cutStringNotNull('ref');
        this.uuid = data.cutStringNotNull('uuid');
        this.title = data.cutStringNotNull('title');
        this.subtitle = data.cutString('subtitle');
        this.subject = data.cutStringNotNull('subject');
        this.grade = data.cutNumberNotNull('grade');
        this.curriculum = data.cutStringNotNull('curriculum');
        this.curriculumUrl = data.cutString('curriculumUrl');
        data.checkEmpty();
    }
}
class Presentation {
    constructor(yamlString) {
        const raw = yaml_1.convertFromYaml(yamlString);
        const data = new data_management_1.DataCutter(raw);
        this.meta = new Meta(data.cutNotNull('meta'));
        this.slides = new slide_collection_1.SlideCollection(data.cutNotNull('slides'));
        data.checkEmpty();
    }
}
exports.Presentation = Presentation;
