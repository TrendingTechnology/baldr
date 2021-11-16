import { HTMLSVGElement, StepElement } from './step';
declare abstract class Selector {
    rootElement: ParentNode;
    constructor(entry: string | HTMLSVGElement);
    abstract select(): StepElement[];
    count(): number;
    protected createStep(...htmlElements: HTMLSVGElement[]): StepElement;
    static collectStepTexts(steps: StepElement[]): string[];
}
export declare class ElementSelector extends Selector {
    private readonly selectors;
    /**
     * @param entry - A string that can be translated to a DOM using the DOMParser
     *   or a HTML element as an entry to the DOM.
     * @param selectors - A string to feed `document.querySelectorAll()`.
     */
    constructor(entry: string | HTMLSVGElement, selectors: string);
    select(): StepElement[];
}
declare type InkscapeMode = 'layer' | 'layer+' | 'group';
export declare class InkscapeSelector extends Selector {
    mode: InkscapeMode;
    constructor(entry: string | HTMLSVGElement, mode?: InkscapeMode);
    private getLayerElements;
    select(): StepElement[];
}
export declare class ClozeSelector extends Selector {
    select(): StepElement[];
}
/**
 * Select words which are surrounded by `span.word`.
 */
export declare class WordSelector extends Selector {
    select(): StepElement[];
}
export {};
