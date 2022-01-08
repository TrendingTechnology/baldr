import { buildSubsetIndexes } from '@bldr/core-browser';
/**
 * Generate steps by hiding and showing some DOM elements.
 */
export class StepController {
    constructor(steps, subsetSpecifier) {
        this.steps = steps;
        if (subsetSpecifier != null) {
            this.subsetIndexes = buildSubsetIndexes(subsetSpecifier, this.steps.length + 1, -2);
        }
    }
    /**
     * The number of steps is one greater then the number of step objects.
     */
    get stepCount() {
        if (this.subsetIndexes != null) {
            return this.subsetIndexes.length + 1;
        }
        return this.steps.length + 1;
    }
    get subsetBeginIndex() {
        if (this.subsetIndexes != null) {
            return this.subsetIndexes[0];
        }
        return 0;
    }
    /**
     * Hide all elements.
     */
    hideAll() {
        for (const step of this.steps) {
            step.hide();
        }
    }
    hideFromSubsetBegin() {
        for (let index = 0; index < this.subsetBeginIndex; index++) {
            this.steps[index].show();
        }
        for (let index = this.subsetBeginIndex; index < this.steps.length; index++) {
            this.steps[index].hide();
        }
    }
    getStep(indexFromZero) {
        let index = indexFromZero;
        if (this.subsetIndexes != null) {
            index = this.subsetIndexes[index];
        }
        return this.steps[index];
    }
    /**
     * Show all elements up to and including the element with the number
     * `stepNummer`. The number of steps is: number of elements + 1.
     *
     * @param stepNumber - A consecutive number from 1 (all step elements are
     *   hidden) to step element count + 1.
     *
     * @returns The element that is displayed by the new step number.
     */
    showUpTo(stepNumber) {
        let currentStep;
        for (let index = 0; index < this.stepCount - 1; index++) {
            const step = this.getStep(index);
            step.setVisibilityStatus(stepNumber > index + 1);
            if (stepNumber === index + 2) {
                currentStep = step;
            }
        }
        return currentStep;
    }
}
