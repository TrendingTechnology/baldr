export declare type HTMLSVGElement = SVGElement | HTMLElement;
/**
 * A wrapper class around a HTML or a SVG element to be able to hide and show
 * this element very easily.
 */
export declare class StepElement {
    /**
     * Whether the element should vanish by using the CSS style `display: none`
     *   instead of `visibility: hidden`
     */
    private readonly vanishing;
    htmlElements: HTMLSVGElement[];
    isVisible: boolean;
    onShow?: () => void;
    onHide?: () => void;
    /**
     * @property Multiple HTML elements as an array or a single HTML element.
     * @property vanish - Whether the element should vanish by using the CSS style
     *   `display: none` instead of `visibility: hidden`
     */
    constructor(elements: HTMLSVGElement[] | HTMLSVGElement, vanishing?: boolean);
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
