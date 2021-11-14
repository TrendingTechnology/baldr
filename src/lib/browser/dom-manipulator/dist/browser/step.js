/**
 * A wrapper class for a HTML element to be able to hide and show easily some
 * HTML elements.
 */
export class Step {
    /**
     * @property Multiple HTML elements as an array or a
     *   single HTML element.
     * @property useVisiblilty - Set the visibility
     *   `element.style.visibility` instead of the display state.
     */
    constructor(elements, useVisiblilty = false) {
        if (Array.isArray(elements)) {
            this.htmlElements = elements;
        }
        else {
            this.htmlElements = [elements];
        }
        this.useVisiblilty = useVisiblilty;
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
    setState(isVisible) {
        for (const element of this.htmlElements) {
            if (isVisible) {
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
        this.setState(true);
    }
    hide() {
        this.setState(false);
    }
}
