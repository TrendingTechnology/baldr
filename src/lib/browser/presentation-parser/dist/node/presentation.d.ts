import { LampTypes } from '@bldr/type-definitions';
import { SlideCollection } from './slide-collection';
import { Resolver } from '@bldr/media-resolver-ng';
export declare const resolver: Resolver;
/**
 * @inheritdoc
 */
declare class Meta implements LampTypes.PresentationMeta {
    /**
     * @inheritdoc
     */
    ref: string;
    /**
     * @inheritdoc
     */
    uuid: string;
    /**
     * @inheritdoc
     */
    title: string;
    /**
     * @inheritdoc
     */
    subtitle?: string;
    /**
     * @inheritdoc
     */
    subject: string;
    /**
     * @inheritdoc
     */
    grade: number;
    /**
     * @inheritdoc
     */
    curriculum: string;
    /**
     * @inheritdoc
     */
    curriculumUrl?: string;
    constructor(raw: any);
    /**
     * Log to the console.
     */
    log(): void;
}
export declare class Presentation {
    meta: Meta;
    slides: SlideCollection;
    constructor(yamlString: string);
    resolveMediaAssets(): Promise<void>;
    /**
     * Log to the console.
     */
    log(): void;
}
export {};
