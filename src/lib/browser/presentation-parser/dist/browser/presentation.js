import { convertFromYaml } from '@bldr/yaml';
import { DataCutter } from './data-management';
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
    }
}
