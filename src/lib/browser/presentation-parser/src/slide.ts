import { PresentationTypes } from '@bldr/type-definitions'

 class SlideMetaData implements PresentationTypes.SlideMetaData {

}

/**
 * A slide.
 */
export class Slide implements PresentationTypes.Slide {
  rawData: any
  no: number
  level: number
  slides: Slide[]
  constructor(rawData: any) {
    this.rawData = rawData
    this.no = 0
    this.level = 0
    this.slides = []
  }
}
