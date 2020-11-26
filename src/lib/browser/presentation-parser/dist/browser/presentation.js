/**
 * A presentation is represented by the YAML file `Praesentation.baldr.yml`.
 * A presentation contains slides and meta data.
 */
export class Presentation {
    constructor(slides, slidesTree) {
        this.slides = slides;
        this.slidesTree = slidesTree;
    }
}
