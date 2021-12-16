import { LampTypes } from '@bldr/type-definitions';
import { Builder, MediaData } from './builder';
export interface PresentationData extends MediaData, LampTypes.FileFormat {
}
export declare class PresentationBuilder extends Builder {
    data: PresentationData;
    constructor(filePath: string);
    enrichMetaProp(): PresentationBuilder;
    buildAll(): PresentationBuilder;
    export(): PresentationData;
}
