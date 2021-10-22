import { LampTypes } from '@bldr/type-definitions';
declare class Presentation {
    meta: LampTypes.PresentationMeta;
    constructor(yamlString: string);
}
export declare function parse(yamlString: string): Presentation;
export {};
