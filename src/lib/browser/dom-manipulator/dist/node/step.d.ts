export declare type HTMLSVGElement = SVGElement | HTMLElement;
/**
 * A wrapper class around a HTML or a SVG element to be able to hide and show
 * this element very easily.
 */
export declare class StepElement {
    htmlElements: HTMLSVGElement[];
    private readonly useVisiblilty;
    isVisible: boolean;
    /**
     * @property Multiple HTML elements as an array or a
     *   single HTML element.
     * @property useVisiblilty - Set the visibility
     *   `element.style.visibility` instead of the display state.
     */
    constructor(elements: HTMLSVGElement[] | HTMLSVGElement, useVisiblilty?: boolean);
    /**
     * The last HTML element.
     */
    get htmlElement(): HTMLSVGElement;
    get text(): string | undefined;
    setVisibilityStatus(show: boolean): void;
    show(): void;
    hide(): void;
}
