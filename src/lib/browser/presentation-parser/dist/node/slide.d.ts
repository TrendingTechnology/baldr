import { PresentationTypes } from '@bldr/type-definitions';
/**
 * A slide.
 */
export declare class Slide implements PresentationTypes.Slide {
    rawData: any;
    no: number;
    level: number;
    slides: Slide[];
    constructor(rawData: any);
}
