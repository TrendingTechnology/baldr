"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const core_browser_1 = require("@bldr/core-browser");
/**
 * Generate steps by hiding and showing some DOM elements.
 */
class Controller {
    constructor(steps, subsetSpecifier) {
        this.steps = steps;
        if (subsetSpecifier != null) {
            this.subsetIndexes = (0, core_browser_1.buildSubsetIndexes)(subsetSpecifier, this.steps.length + 1, -2);
        }
    }
    /**
     * The number of steps
     */
    get count() {
        if (this.subsetIndexes != null) {
            return this.subsetIndexes.length + 1;
        }
        return this.steps.length + 1;
    }
    /**
     * Hide all elements.
     */
    hideAll() {
        for (const step of this.steps) {
            step.hide();
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
     * Set the display / visiblilty state on HTML elements. Loop through all
     * elements or perform a minimal update. On the first step no elements are
     * displayed. The number of steps is: number of elements + 1.
     *
     * @param stepNumber - A consecutive number from 1 (all step elements are
     *   hidden) to step element count + 1.
     *
     * @returns The element that is displayed by the new step number.
     */
    showUpTo(stepNumber) {
        let currentElement;
        for (let index = 0; index < this.count - 1; index++) {
            const step = this.getStep(index);
            step.setState(stepNumber > index + 1);
            if (stepNumber === index + 2) {
                currentElement = step.htmlElement;
            }
        }
        return currentElement;
    }
}
exports.Controller = Controller;
