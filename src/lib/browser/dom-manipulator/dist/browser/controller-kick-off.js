import { ClozeSelector } from './selector';
import { StepController } from './controller';
export function createClozeStepController(entry, stepSubset) {
    const selector = new ClozeSelector(entry);
    return new StepController(selector.select(), stepSubset);
}
