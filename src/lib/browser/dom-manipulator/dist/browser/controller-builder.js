import { ClozeSelector, ElementSelector, InkscapeSelector } from './selector';
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
