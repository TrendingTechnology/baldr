import { ClozeSelector, ElementSelector, InkscapeSelector, WordSelector, SentenceSelector } from './selector';
import { StepController } from './controller';
export function buildClozeStepController(entry, stepSubset) {
    const selector = new ClozeSelector(entry);
    return new StepController(selector.select(), stepSubset);
}
export function buildSvgStepController(entry, fields) {
    let selector;
    if (fields.stepSelector != null) {
        selector = new ElementSelector(entry, fields.stepSelector);
    }
    else {
        selector = new InkscapeSelector(entry, fields.mode);
    }
    return new StepController(selector.select(), fields.stepSubset);
}
export function buildTextStepController(entry, fields) {
    let selector;
    if (fields.stepMode == null) {
        fields.stepMode = 'words';
    }
    if (fields.stepMode === 'words') {
        selector = new WordSelector(entry);
    }
    else {
        selector = new SentenceSelector(entry);
    }
    return new StepController(selector.select(), fields.stepSubset);
}
