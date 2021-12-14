import { LampTypes } from '@bldr/type-definitions';
import { Builder, MediaData } from './builder';
export interface PresentationData extends MediaData, LampTypes.FileFormat {
}
/**
 * The whole presentation YAML file converted to an Javascript object. All
 * properties are in `camelCase`.
 */
export declare class PresentationBuilder extends Builder {
    data: PresentationData;
    constructor(filePath: string);
    enrichMetaProp(): PresentationBuilder;
    buildAll(): PresentationBuilder;
    export(): PresentationData;
}
