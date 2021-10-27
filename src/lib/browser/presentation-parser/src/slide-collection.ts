import { Slide } from './slide'

/**
 * A container class to store all slide object of a presentation.
 */
export class SlideCollection {
  /**
   * A flat list of slide objects. All child slides are included in this
   * array.
   */
  public flat: Slide[] = []

  /**
   * Only the top level slide objects are included in this array. Child slides
   * can be accessed under the `slides` property.
   */
  public tree: Slide[] = []

  /**
   * @param raw - The raw slide array from the presentation’s slide property.
   */
  constructor (raw: any[]) {
    this.parse(raw, this.tree, 1)
  }

  /**
   * Parse the slide objects in a recursive fashion. Child slides can be specified
   * under the `slides` property.
   *
   * @param raw - The raw slide array from the YAML presentation
   *  file, the slides property.
   * @param level - The level in the hierachial tree the slide lies in 1:
   *   Main level, 2: First child level ...
   */
  private parse (raw: any[], slidesTree: Slide[], level: number): void {
    for (const slideRaw of raw) {
      if (slideRaw.state !== 'absent') {
        const childSlides = slideRaw.slides
        delete slideRaw.slides
        const slide = new Slide(slideRaw, this.flat.length + 1, level)
        this.flat.push(slide)
        slidesTree.push(slide)
        if (childSlides != null && Array.isArray(childSlides)) {
          slide.slides = []
          this.parse(childSlides, slide.slides, level + 1)
        }
      }
    }
  }
}
