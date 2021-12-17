import { LampTypes } from '@bldr/type-definitions';
import { Builder, MediaData } from './builder';
export interface PresentationData extends MediaData, LampTypes.FileFormat {
}
export interface DbPresentationData extends PresentationData {
}
export declare class PresentationBuilder extends Builder {
    data: PresentationData;
    constructor(filePath: string);
    enrichMetaProp(): PresentationBuilder;
    build(): PresentationData;
    buildForDb(): DbPresentationData;
}
