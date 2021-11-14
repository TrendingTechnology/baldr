import { HTMLSVGElement, Step } from './step';
declare abstract class Selector {
    rootElement: ParentNode;
    constructor(entry: string | HTMLSVGElement);
    abstract select(): Step[];
    count(): number;
}
export declare class ElementSelector extends Selector {
    private readonly selectors;
    constructor(entry: string | HTMLSVGElement, selectors: string);
    select(): Step[];
}
declare type InkscapeMode = 'layer' | 'layer+' | 'group';
export declare class InkscapeSelector extends Selector {
    mode: InkscapeMode;
    constructor(entry: string | HTMLSVGElement, mode?: InkscapeMode);
    private getLayerElements;
    select(): Step[];
}
export declare class ClozeSelector extends Selector {
    select(): Step[];
}
export {};
