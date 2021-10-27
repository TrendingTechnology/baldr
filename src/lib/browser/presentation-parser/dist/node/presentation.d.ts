import { LampTypes } from '@bldr/type-definitions';
import { SlideCollection } from './slide-collection';
export declare class Presentation {
    meta: LampTypes.PresentationMeta;
    slides: SlideCollection;
    constructor(yamlString: string);
}
