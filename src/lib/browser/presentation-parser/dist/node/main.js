"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const yaml_1 = require("@bldr/yaml");
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
        const raw = yaml_1.convertFromYaml(yamlString);
        if (raw.meta == null) {
            throw new Error('No meta informations found.');
        }
        this.meta = new Meta(raw.meta);
    }
}
function parse(yamlString) {
    return new Presentation(yamlString);
}
exports.parse = parse;
