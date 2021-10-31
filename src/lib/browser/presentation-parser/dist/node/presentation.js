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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presentation = exports.resolver = void 0;
const yaml_1 = require("@bldr/yaml");
const data_management_1 = require("./data-management");
const slide_collection_1 = require("./slide-collection");
const media_resolver_ng_1 = require("@bldr/media-resolver-ng");
exports.resolver = new media_resolver_ng_1.Resolver();
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
    resolveMediaAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            yield exports.resolver.resolve(this.slides.mediaUris, true);
            yield exports.resolver.resolve(this.slides.optionalMediaUris, false);
        });
    }
}
exports.Presentation = Presentation;
