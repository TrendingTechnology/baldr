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
    props: MasterTypes.StringObject;
    propsMain?: MasterTypes.StringObject;
    propsPreview?: MasterTypes.StringObject;
    mediaUris?: Set<string>;
    optionalMediaUris?: Set<string>;
    stepCount?: number;
    stepNo?: number;
    constructor(rawData: any);
}
