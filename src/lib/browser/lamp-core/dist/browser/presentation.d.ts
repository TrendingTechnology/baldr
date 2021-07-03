import type { LampTypes } from '@bldr/type-definitions';
import { Slide } from './slide';
/**
 * A presentation is represented by the YAML file `Praesentation.baldr.yml`.
 * A presentation contains slides and meta data.
 */
export declare class Presentation implements LampTypes.Presentation {
    slides: Slide[];
    slidesTree: Slide[];
    meta: LampTypes.PresentationMeta;
    /**
     * Parse the YAML file `Praesentation.baldr.yml`.
     *
     * @property rawYamlString - The raw YAML string of the YAML file
     *   `Praesentation.baldr.yml`
     */
    constructor(rawYamlString: string);
    /**
     * Parse the slide objects in a recursive fashion. Child slides can be specified
     * under the `slides` property.
     *
     * @param slidesRaw - The raw slide array from the YAML presentation
     *  file, the slides property.
     * @param slidesFlat - A array which is filled with every slide object.
     * @param slidesTree - A array which is filled with only top level slide
     *   objects.
     * @param level - The level in the hierachial tree the slide lies in 1:
     *   Main level, 2: First child level ...
     */
    static parseSlidesRecursive(slidesRaw: any[], slidesFlat: Slide[], slidesTree: Slide[], level?: number): void;
}
