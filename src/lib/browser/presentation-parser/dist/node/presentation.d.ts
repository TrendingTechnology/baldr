import { LampTypes } from '@bldr/type-definitions';
import { SlideCollection } from './slide-collection';
import { Resolver } from '@bldr/media-resolver-ng';
export declare const resolver: Resolver;
export declare class Presentation {
    meta: LampTypes.PresentationMeta;
    slides: SlideCollection;
    constructor(yamlString: string);
    resolveMediaAssets(): Promise<void>;
}
