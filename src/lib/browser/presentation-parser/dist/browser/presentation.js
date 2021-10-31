var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { convertFromYaml } from '@bldr/yaml';
import { DataCutter } from './data-management';
import { SlideCollection } from './slide-collection';
import { Resolver } from '@bldr/media-resolver-ng';
export const resolver = new Resolver();
/**
 * @inheritdoc
 */
class Meta {
    constructor(raw) {
        const data = new DataCutter(raw);
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
export class Presentation {
    constructor(yamlString) {
        const raw = convertFromYaml(yamlString);
        const data = new DataCutter(raw);
        this.meta = new Meta(data.cutNotNull('meta'));
        this.slides = new SlideCollection(data.cutNotNull('slides'));
        data.checkEmpty();
    }
    resolveMediaAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            yield resolver.resolve(this.slides.mediaUris, true);
            yield resolver.resolve(this.slides.optionalMediaUris, false);
        });
    }
}
