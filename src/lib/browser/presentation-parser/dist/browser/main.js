import { convertFromYaml } from '@bldr/yaml';
class Meta {
    constructor(rawObject) {
        this.ref = this.getStringProperty(rawObject, 'ref');
        this.title = this.getStringProperty(rawObject, 'title');
        this.subtitle = this.getStringProperty(rawObject, 'subtitle');
        this.subject = this.getStringProperty(rawObject, 'subject');
        this.curriculum = this.getStringProperty(rawObject, 'curriculum');
        this.checkNull(rawObject, 'grade');
        if (typeof rawObject.grade !== 'number') {
            throw new Error(`meta.grade is not a number.`);
        }
        this.grade = rawObject.grade;
    }
    checkNull(raw, propertyName) {
        if (raw[propertyName] == null) {
            throw new Error(`meta.${propertyName} must not be zero.`);
        }
    }
    getStringProperty(raw, propertyName) {
        this.checkNull(raw, propertyName);
        if (typeof raw[propertyName] !== 'string') {
            throw new Error(`meta.${propertyName} is not a string.`);
        }
        return raw[propertyName];
    }
}
class Presentation {
    constructor(yamlString) {
        const raw = convertFromYaml(yamlString);
        if (raw.meta == null) {
            throw new Error('No meta informations found.');
        }
        this.meta = new Meta(raw.meta);
    }
}
export function parse(yamlString) {
    return new Presentation(yamlString);
}
