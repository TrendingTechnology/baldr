/**
 * Provide the class “Master”.
 */
import { Resolver } from '@bldr/media-resolver';
import { Slide } from './slide';
import { StepCollector } from './step';
import { Fields, FieldDefinitionCollection } from './field';
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
    processMediaUris(fields?: Fields): Set<string>;
    processOptionalMediaUris(fields?: Fields): Set<string>;
    collectStepsOnInstantiation(fields: Fields, stepCollector: StepCollector): void;
    generateTexMarkup(fields: Fields): string | undefined;
    /**
     * Before resolving
     */
    initializeFields(fields: Fields): Fields;
    /**
     * After the media resolution.
     */
    finalizeSlide(slide: Slide, resolver: Resolver): Fields | undefined;
    deriveTitleFromFields(fields: any): string | undefined;
    derivePlainTextFromFields(fields: any): string | undefined;
}
export {};
