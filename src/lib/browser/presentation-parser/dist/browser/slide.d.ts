import { PresentationTypes, MasterTypes } from '@bldr/type-definitions';
/**
 * A slide.
 */
export declare class Slide implements PresentationTypes.Slide {
    rawData: any;
    no: number;
    level: number;
    meta: PresentationTypes.SlideMeta;
    slides: Slide[];
    master: MasterTypes.Master;
    constructor(rawData: any);
}
