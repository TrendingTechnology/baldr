import { HTMLSVGElement, StepElement } from './step';
export declare type DomEntry = string | HTMLSVGElement;
declare abstract class Selector {
    rootElement: ParentNode;
    constructor(entry: DomEntry);
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
export declare type InkscapeMode = 'layer' | 'layer+' | 'group';
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
/**
 * Select more than a word. The meaning  of "sentences" in the function name
 * should not be understood literally, but symbolic for a longer text unit.
 * Select a whole paragraph (`<p>`) or a heading `<h1>` or `<li>` items of
 * ordered or unordered lists, or a table row.
 */
export declare class SentenceSelector extends Selector {
    select(): StepElement[];
}
export {};
