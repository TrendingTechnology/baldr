import { DomEntry, InkscapeMode } from './selector';
import { StepController } from './controller';
export declare function buildClozeStepController(entry: DomEntry, stepSubset?: string): StepController;
interface InteractiveGraphicFields {
    stepSelector?: string;
    mode?: InkscapeMode;
    stepSubset?: string;
}
export declare function buildSvgStepController(entry: DomEntry, fields: InteractiveGraphicFields): StepController;
export {};
