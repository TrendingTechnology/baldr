/**
 * A wrapper class around a HTML or a SVG element to be able to hide and show
 * this element very easily.
 */
export class StepElement {
    /**
     * @property Multiple HTML elements as an array or a
     *   single HTML element.
     * @property useVisibliltyStyleProperty - Set the visibility
     *   `element.style.visibility` instead of the display state.
     */
    constructor(elements, useVisibliltyStyleProperty = true) {
        this.isVisible = true;
        if (Array.isArray(elements)) {
            this.htmlElements = elements;
        }
        else {
            this.htmlElements = [elements];
        }
        this.useVisiblilty = useVisibliltyStyleProperty;
    }
    executeOnShowEvent() {
        if (this.onShow != null) {
            this.onShow();
        }
    }
    executeOnHideEvent() {
        if (this.onHide != null) {
            this.onHide();
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
        if (show) {
            this.executeOnShowEvent();
        }
        else {
            this.executeOnHideEvent();
        }
        for (const element of this.htmlElements) {
            if (show) {
                if (this.useVisiblilty) {
                    element.style.visibility = 'visible';
                }
                else {
                    element.style.display = 'block';
                }
            }
            else {
                if (this.useVisiblilty) {
                    element.style.visibility = 'hidden';
                }
                else {
                    element.style.display = 'none';
                }
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
