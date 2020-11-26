import { PresentationTypes } from '@bldr/type-definitions';
import { Slide } from './slide';
/**
 * A presentation is represented by the YAML file `Praesentation.baldr.yml`.
 * A presentation contains slides and meta data.
 */
export declare class Presentation implements PresentationTypes.Presentation {
    slides: Slide[];
    slidesTree: Slide[];
    constructor(slides: Slide[], slidesTree: Slide[]);
}
