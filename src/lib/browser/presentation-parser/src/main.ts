/**
 * Parse the slide objects in a recursive fashion. Child slides can be specified
 * under the `slides` property.
 *
 * @param {Array} slidesRaw - The raw slide array from the YAML presentation
 *  file, the slides property.
 * @param {Array} slidesFlat - A array which is filled with every slide object.
 * @param {Array} slidesTree - A array which is filled with only top level slide
 *   objects.
 * @param {Number} level - The level in the hierachial tree the slide lies in 1:
 *   Main level, 2: First child level ...
 */
function parseSlidesRecursive (slidesRaw, slidesFlat, slidesTree, level = 1) {
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
