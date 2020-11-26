class SlideMetaData {
}
/**
 * A slide.
 */
export class Slide {
    constructor(rawData) {
        this.rawData = rawData;
        this.no = 0;
        this.level = 0;
        this.slides = [];
    }
}
