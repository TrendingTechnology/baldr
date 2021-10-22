import { convertFromYaml } from '@bldr/yaml';
/**
 * @inheritdoc
 */
class Meta {
    constructor(raw) {
        this.ref = this.getStringProperty(raw, 'ref');
        this.uuid = this.getStringProperty(raw, 'uuid');
        this.title = this.getStringProperty(raw, 'title');
        this.subject = this.getStringProperty(raw, 'subject');
        this.curriculum = this.getStringProperty(raw, 'curriculum');
        this.checkNull(raw, 'grade');
        this.checkNumber(raw, 'grade');
        this.grade = raw.grade;
        if (raw.curriculumUrl !== null && typeof raw.curriculumUrl === 'string') {
            this.curriculumUrl = raw.curriculumUrl;
        }
        if (raw.subtitle !== null && typeof raw.subtitle === 'string') {
            this.subtitle = raw.subtitle;
        }
    }
    checkString(raw, propertyName) {
        if (typeof raw[propertyName] !== 'string') {
            throw new Error(`meta.${propertyName} is not a string.`);
        }
    }
    checkNumber(raw, propertyName) {
        if (typeof raw[propertyName] !== 'number') {
            throw new Error(`meta.${propertyName} is not a number.`);
        }
    }
    checkNull(raw, propertyName) {
        if (raw[propertyName] == null) {
            throw new Error(`meta.${propertyName} must not be zero.`);
        }
    }
    getStringProperty(raw, propertyName) {
        this.checkNull(raw, propertyName);
        this.checkString(raw, propertyName);
        return raw[propertyName];
    }
}
export class Presentation {
    constructor(yamlString) {
        const raw = convertFromYaml(yamlString);
        if (raw.meta == null) {
            throw new Error('No meta informations found.');
        }
        this.meta = new Meta(raw.meta);
    }
}
