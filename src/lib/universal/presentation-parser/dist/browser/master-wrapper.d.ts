/**
 * Provide the class “Master”.
 */
import { Resolver } from '@bldr/media-resolver-ng';
import { Slide } from './slide';
import { StepCollector } from './step';
import { FieldData, FieldDefinitionCollection } from './field';
import { MasterIconSpec, MasterSpec } from './master-specification';
declare type MasterConstructor = new () => MasterSpec;
/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
declare class MasterIcon implements MasterIconSpec {
    name: string;
    color: string;
    size: 'large' | 'small';
    showOnSlides: boolean;
    unicodeSymbol?: string;
    constructor({ name, color, size, showOnSlides, unicodeSymbol }: MasterIconSpec);
}
/**
 * Wraps a master specification object. Processes, hides, forwards the field
 * data of the slides and methods.
 */
export declare class Master {
    private readonly master;
    icon: MasterIcon;
    constructor(MasterClass: MasterConstructor);
    get fieldsDefintion(): FieldDefinitionCollection;
    get name(): string;
    get displayName(): string;
    /**
     * A description text in HTML format.
     */
    get description(): string | undefined;
    /**
     * Convert to a set and remove sample fragments, e. g. `#complete`
     */
    private static processMediaUris;
    processMediaUris(fields?: FieldData): Set<string>;
    processOptionalMediaUris(fields?: FieldData): Set<string>;
    collectStepsOnInstantiation(fields: FieldData, stepCollector: StepCollector): void;
    generateTexMarkup(fields: FieldData): string | undefined;
    /**
     * Before resolving
     */
    initializeFields(fields: FieldData): FieldData;
    /**
     * After the media resolution.
     */
    finalizeSlide(slide: Slide, resolver: Resolver): FieldData | undefined;
    deriveTitleFromFields(fields: any): string | undefined;
    derivePlainTextFromFields(fields: any): string | undefined;
}
export {};
