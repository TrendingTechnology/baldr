import { DomEntry, InkscapeMode } from './selector';
import { StepController } from './controller';
export declare function buildClozeStepController(entry: DomEntry, stepSubset?: string): StepController;
interface InteractiveGraphicFields {
    stepSelector?: string;
    mode?: InkscapeMode;
    stepSubset?: string;
}
export declare function buildSvgStepController(entry: DomEntry, fields: InteractiveGraphicFields): StepController;
interface TextFields {
    stepMode?: 'words' | 'sentences';
    stepSubset?: string;
}
export declare function buildTextStepController(entry: DomEntry, fields?: TextFields): StepController;
export declare function buildQuestionStepController(entry: DomEntry): StepController;
export {};
