import { LampTypes } from '@bldr/type-definitions';
import { Resolver, Asset } from '@bldr/media-resolver-ng';
import { SlideCollection } from './slide-collection';
import { Slide } from './slide';
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
    uuid?: string;
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
    subject?: string;
    /**
     * @inheritdoc
     */
    grade?: number;
    /**
     * @inheritdoc
     */
    curriculum?: string;
    /**
     * @inheritdoc
     */
    curriculumUrl?: string;
    /**
     * The relative path containing the filename `Praesentation.baldr.yml`. This
     * attribute is present in the MongoDB records, but not in the local
     * YAML files.
     */
    path?: string;
    constructor(raw: any);
    /**
     * Log to the console.
     */
    log(): void;
}
export declare class Presentation {
    meta: Meta;
    slides: SlideCollection;
    /**
     * The raw YAML string.
     */
    rawYamlString: string;
    /**
     * The raw YAML string with expanded media URI references.
     */
    rawYamlStringExpanded?: string;
    constructor(yamlString: string);
    private cutMeta;
    /**
     * Merge two sources to build a presentation from. A the moment only the
     * meta.path property is taken from the raw presentation object.
     *
     * @param yamlString - The presentation as a YAML string
     * @param raw - A raw presentation object (as stored in the MongoDB).
     *
     * @returns A newly created presentation.
     */
    static mergeYamlStringWithRaw(yamlString: string, raw?: any): Presentation;
    /**
     * Media URIs in the “ref” can be shorted with the string `./`. The
     * abbreviationn `./` is replaced with the presentation reference and a
     * underscore, for example the media URI
     * `ref:Leitmotivtechnik_VD_Verdeutlichung_Duell-Mundharmonika-Frank` can be
     * shortend with `ref:./VD_Verdeutlichung_Duell-Mundharmonika-Frank`. The
     * abbreviationn `./` is inspired by the UNIX dot notation for the current
     * directory.
     *
     * @param rawYamlString - The raw YAML string of the presentation file.
     * @param metaRef - The reference of the presentation.
     *
     * @returns A raw YAML string with fully expanded media URIs.
     */
    private expandMediaRefs;
    /**
     * Convert the raw YAML string into javascript object.
     *
     * @param rawYamlString - The raw YAML string of the presentation file.
     *
     * @returns A data cutter object.
     *
     * @throws {Error} If the media URI references cannot be resolved.
     */
    private convertFromYaml;
    /**
     * The relative path of parent directory, for example
     * `12/20_Tradition/10_Umgang-Tradition/10_Futurismus`.
     */
    get parentDir(): string | undefined;
    resolve(): Promise<Asset[]>;
    /**
     * The first slide of a presentation. It is equivalent to
     * `presentation.slides.flat[0]`.
     */
    get firstSlide(): Slide;
    /**
     * @param no - Slide number starting from 1
     */
    getSlideByNo(no: number): Slide;
    /**
     * @param ref - The slide reference.
     *
     * ```yml
     * - ref: reference
     *   generic: slide
     * ```
     */
    getSlideByRef(ref: string): Slide | undefined;
    /**
     * Log to the console.
     */
    log(): void;
}
export {};
