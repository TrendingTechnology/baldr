export declare type HTMLSVGElement = SVGElement | HTMLElement;
/**
 * A wrapper class for a HTML element to be able to hide and show easily some
 * HTML elements.
 */
export declare class Step {
    htmlElements: HTMLSVGElement[];
    private readonly useVisiblilty;
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
    setState(isVisible: boolean): void;
    show(): void;
    hide(): void;
}
