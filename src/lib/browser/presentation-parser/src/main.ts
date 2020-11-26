import { convertFromYaml } from '@bldr/yaml'

import { Slide } from './slide'
import { Presentation } from './presentation'

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
function parseSlidesRecursive (slidesRaw: any[], slidesFlat: Slide[], slidesTree: Slide[], level: number = 1): void {
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
        parseSlidesRecursive(childSlides, slidesFlat, slide.slides, level + 1)
      }
    }
  }
}

/**
 * Parse the YAML file `Praesentation.baldr.yml`.
 *
 * @property rawYamlString - The raw YAML string of the YAML file
 *   `Praesentation.baldr.yml`
 */
export function parse (rawYamlString: string): Presentation {
  const rawPresentationData = convertFromYaml(rawYamlString)
  const slides: Slide[] = []
  const slidesTree: Slide[] = []
  parseSlidesRecursive(rawPresentationData.slides, slides, slidesTree)
  const presentation = new Presentation(slides, slidesTree)
  return presentation
}
