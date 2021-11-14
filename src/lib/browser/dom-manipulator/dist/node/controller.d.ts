import { Step, HTMLSVGElement } from './step';
/**
 * Generate steps by hiding and showing some DOM elements.
 */
export declare class Controller {
    /**
     * All elements
     */
    steps: Step[];
    subsetIndexes?: number[];
    constructor(steps: Step[], subsetSpecifier?: string);
    /**
     * The number of steps
     */
    get count(): number;
    private get subsetBeginIndex();
    /**
     * Hide all elements.
     */
    hideAll(): void;
    hideFromSubsetBegin(): void;
    private getStep;
    /**
     * Set the display / visiblilty state on HTML elements. On the first step no
     * elements are displayed. The number of steps is: number of elements + 1.
     *
     * @param stepNumber - A consecutive number from 1 (all step elements are
     *   hidden) to step element count + 1.
     *
     * @returns The element that is displayed by the new step number.
     */
    showUpTo(stepNumber: number): HTMLSVGElement | undefined;
}
