import { StepElement } from './step';
/**
 * Generate steps by hiding and showing some DOM elements.
 */
export declare class StepController {
    /**
     * All step elements. One element less than the total number of steps.
     */
    steps: StepElement[];
    /**
     * The array indexes of the specified step subset.
     *
     * Example:
     *
     * ```md
     * 1 2 3 4 5 (Step numbers)
     *   0 1 2 3 (indexes of this.steps)
     *     1 2   (values of this.subsetIndexes of subset specifier '3-4')
     * ```
     */
    subsetIndexes?: number[];
    constructor(steps: StepElement[], subsetSpecifier?: string);
    /**
     * The number of steps is one greater then the number of step objects.
     */
    get stepCount(): number;
    private get subsetBeginIndex();
    /**
     * Hide all elements.
     */
    hideAll(): void;
    hideFromSubsetBegin(): void;
    private getStep;
    /**
     * Show all elements up to and including the element with the number
     * `stepNummer`. The number of steps is: number of elements + 1.
     *
     * @param stepNumber - A consecutive number from 1 (all step elements are
     *   hidden) to step element count + 1.
     *
     * @returns The element that is displayed by the new step number.
     */
    showUpTo(stepNumber: number): StepElement | undefined;
}
