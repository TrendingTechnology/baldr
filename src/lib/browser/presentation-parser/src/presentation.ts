import { PresentationTypes } from '@bldr/type-definitions'
import { convertFromYaml } from '@bldr/yaml'

import { Slide } from './slide'

class Meta implements PresentationTypes.Meta {
  id: string
  title: string
  subtitle?: string
  grade: number
  curriculum: string
  curriculumUrl?: string

  constructor({ id, title, subtitle, grade, curriculum, curriculumUrl }: PresentationTypes.Meta) {
    this.id = id
    this.title = title
    this.subtitle = subtitle
    this.grade = grade
    this.curriculum = curriculum
    this.curriculumUrl = curriculumUrl
  }
}

/**
 * A presentation is represented by the YAML file `Praesentation.baldr.yml`.
 * A presentation contains slides and meta data.
 */
export class Presentation implements PresentationTypes.Presentation {
  slides: Slide[]
  slidesTree: Slide[]
  meta: PresentationTypes.Meta

  /**
   * Parse the YAML file `Praesentation.baldr.yml`.
   *
   * @property rawYamlString - The raw YAML string of the YAML file
   *   `Praesentation.baldr.yml`
   */
  constructor(rawYamlString: string) {
    const rawPresentationData = convertFromYaml(rawYamlString)

    this.meta = new Meta(rawPresentationData.meta)

    this.slides = []
    this.slidesTree = []
    Presentation.parseSlidesRecursive(rawPresentationData.slides, this.slides, this.slidesTree)
  }

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
  static parseSlidesRecursive (slidesRaw: any[], slidesFlat: Slide[], slidesTree: Slide[], level: number = 1): void {
    for (const slideRaw of slidesRaw) {
      if (slideRaw.state !== 'absent') {
        const childSlides = slideRaw.slides
        delete slideRaw.slides
        const slide = new Slide(slideRaw)
        slidesFlat.push(slide)
        slidesTree.push(slide)
        slide.no = slidesFlat.length
        slide.level = level
        if (childSlides && Array.isArray(childSlides)) {
          Presentation.parseSlidesRecursive(childSlides, slidesFlat, slide.slides, level + 1)
        }
      }
    }
  }
}
