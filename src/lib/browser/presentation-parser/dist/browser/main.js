import { Presentation } from './presentation';
export function parse(yamlString) {
    return new Presentation(yamlString);
}
