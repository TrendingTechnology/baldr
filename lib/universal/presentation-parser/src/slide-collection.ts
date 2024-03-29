import { Slide } from './slide'

/**
 * A container class to store all slide objects of a presentation.
 */
export class SlideCollection {
  /**
   * A flat list of slide objects. All child slides are included in this
   * array.
   */
  public flat: Slide[] = []

  /**
   * Only the top level slide objects are included in this array. Child slides
   * can be accessed under the `slides` property of each slide object.
   */
  public tree: Slide[] = []

  public withRef: { [ref: string]: Slide } = {}

  public mediaUris: Set<string>

  public optionalMediaUris: Set<string>

  /**
   * @param raw - The raw slide array from the presentation’s slide property.
   */
  constructor (raw: any[]) {
    this.parse(raw, this.tree, 1)
    this.mediaUris = this.collectMediaUris()
    this.optionalMediaUris = this.collectOptionalMediaUris()
  }

  /**
   * Parse the slide objects in a recursive fashion. Child slides can be
   * specified under the `slides` property.
   *
   * @param raw - The raw slide array from the YAML presentation file, the
   *  slides property.
   * @param level - The level in the hierachial tree the slide lies in 1: Main
   *   level, 2: First child level ...
   */
  private parse (raw: any[], slidesTree: Slide[], level: number): void {
    for (const slideRaw of raw) {
      if (slideRaw.state !== 'absent') {
        const childSlides = slideRaw.slides
        delete slideRaw.slides
        const slide = new Slide(slideRaw, this.flat.length + 1, level)
        if (slide.meta.ref != null) {
          if (this.withRef[slide.meta.ref] != null) {
            throw new Error(`Duplicate slide reference: ${slide.meta.ref}`)
          }
          this.withRef[slide.meta.ref] = slide
        }
        this.flat.push(slide)
        slidesTree.push(slide)
        if (childSlides != null && Array.isArray(childSlides)) {
          slide.slides = []
          this.parse(childSlides, slide.slides, level + 1)
        }
      }
    }
  }

  /**
   * The media URIs from the slide attributes `mediaUris` and `audioOverlay`.
   */
  private collectMediaUris (): Set<string> {
    const result = new Set<string>()
    for (const slide of this.flat) {
      for (const mediaUri of slide.mediaUris) {
        result.add(mediaUri)
      }
      if (slide.audioOverlay != null) {
        for (const mediaUri of slide.audioOverlay.uris) {
          result.add(mediaUri)
        }
      }
    }
    return result
  }

  private collectOptionalMediaUris (): Set<string> {
    const result = new Set<string>()
    for (const slide of this.flat) {
      for (const mediaUri of slide.optionalMediaUris) {
        result.add(mediaUri)
      }
    }
    return result
  }

  get numberOfSlides (): number {
    return this.flat.length
  }

  * [Symbol.iterator] (): Generator<Slide, any, any> {
    for (const slide of this.flat) {
      yield slide
    }
  }
}
