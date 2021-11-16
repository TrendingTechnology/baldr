"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepElement = void 0;
/**
 * A wrapper class around a HTML or a SVG element to be able to hide and show
 * this element very easily.
 */
class StepElement {
    /**
     * @property Multiple HTML elements as an array or a
     *   single HTML element.
     * @property useVisiblilty - Set the visibility
     *   `element.style.visibility` instead of the display state.
     */
    constructor(elements) {
        this.isVisible = true;
        if (Array.isArray(elements)) {
            this.htmlElements = elements;
        }
        else {
            this.htmlElements = [elements];
        }
    }
    /**
     * The last HTML element.
     */
    get htmlElement() {
        return this.htmlElements[this.htmlElements.length - 1];
    }
    get text() {
        if (this.htmlElement.textContent != null) {
            return this.htmlElement.textContent;
        }
    }
    setVisibilityStatus(show) {
        if (this.isVisible === show) {
            return;
        }
        this.isVisible = show;
        for (const element of this.htmlElements) {
            if (show) {
                element.style.visibility = 'visible';
            }
            else {
                element.style.visibility = 'hidden';
            }
        }
    }
    show() {
        this.setVisibilityStatus(true);
    }
    hide() {
        this.setVisibilityStatus(false);
    }
}
exports.StepElement = StepElement;
