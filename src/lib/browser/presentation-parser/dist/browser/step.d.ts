declare type StepSpecificationRaw = string | StepSpecification;
interface StepSpecification {
    title: string;
    shortcut?: string;
}
/**
 * A slide can have several steps. A step is comparable to the animations of
 * Powerpoint or LibreOffice Impress.
 */
export interface Step extends StepSpecification {
    /**
     * The first step number is one.
     */
    no: number;
}
export declare class StepCollector {
    steps: Step[];
    constructor();
    add(spec: StepSpecificationRaw): void;
}
export {};
