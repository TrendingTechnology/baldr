import type { LampTypes } from '@bldr/type-definitions';
/**
 * A slide.
 */
export declare class Slide implements LampTypes.Slide {
    rawData: any;
    no: number;
    level: number;
    meta: LampTypes.SlideMeta;
    slides: Slide[];
    master: LampTypes.Master;
    props: LampTypes.StringIndexedData;
    propsMain?: LampTypes.StringIndexedData;
    propsPreview?: LampTypes.StringIndexedData;
    mediaUris?: Set<string>;
    optionalMediaUris?: Set<string>;
    stepCount?: number;
    stepNo?: number;
    constructor(rawData: any);
}
