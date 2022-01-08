import { MediaDataTypes } from '@bldr/type-definitions';
import { Builder } from './builder';
export declare class PresentationBuilder extends Builder {
    data: MediaDataTypes.PresentationData;
    constructor(filePath: string);
    enrichMetaProp(): PresentationBuilder;
    build(): MediaDataTypes.PresentationData;
}
