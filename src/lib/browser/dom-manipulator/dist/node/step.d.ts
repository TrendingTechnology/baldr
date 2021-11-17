export declare type HTMLSVGElement = SVGElement | HTMLElement;
/**
 * A wrapper class around a HTML or a SVG element to be able to hide and show
 * this element very easily.
 */
export declare class StepElement {
    /**
     * For example the master slide `question` uses `display = 'none'` to
     * hide the answers.
     */
    private readonly useVisiblilty;
    htmlElements: HTMLSVGElement[];
    isVisible: boolean;
    onShow?: () => void;
    onHide?: () => void;
    /**
     * @property Multiple HTML elements as an array or a
     *   single HTML element.
     * @property useVisibliltyStyleProperty - Set the visibility
     *   `element.style.visibility` instead of the display state.
     */
    constructor(elements: HTMLSVGElement[] | HTMLSVGElement, useVisibliltyStyleProperty?: boolean);
    private executeOnShowEvent;
    private executeOnHideEvent;
    /**
     * The last HTML element.
     */
    get htmlElement(): HTMLSVGElement;
    get text(): string | undefined;
    setVisibilityStatus(show: boolean): void;
    show(): void;
    hide(): void;
}
export declare class ListStep extends StepElement {
    constructor(element: HTMLSVGElement);
    /**
     * `<ul><li><span class="word">First</span> <span class="word">Second</span> <li></ul>`
     */
    static is(element: HTMLSVGElement): boolean;
}
export declare class HeadingStep extends StepElement {
    constructor(element: HTMLSVGElement);
    static is(element: HTMLElement): boolean;
}
