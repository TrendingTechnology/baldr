/**
 * @file Master slide “person”
 * @module @bldr/master-person
 */

'use strict'

// Project packages.
const { Media, checkProperty } = require('@bldr/foundation-master')

/***********************************************************************
 * Hooks
 **********************************************************************/

exports.name = 'person'

/**
 * @see {@link module:@bldr/core/masters~Master#config}
 */
exports.config = {
  margin: false
}

/**
 * @see {@link module:@bldr/core/masters~Master#documentation}
 */
exports.documentation = {
  examples: [
    `
- person:
     name: Ludwig van Beethoven
     image: images/beethoven.jpg
     birth: 1770
     death: 1827
`
  ]
}

/**
 * @see {@link module:@bldr/core/masters~Master#normalizeData}
 */
exports.normalizeData = function (rawSlideData, config) {
  const data = {}

  if (checkProperty.isString(rawSlideData, 'name')) {
    data.name = rawSlideData.name
  }

  const images = new Media(config.sessionDir)
  const image = images.list(rawSlideData.image, 'image')
  if (image && image !== [] && image[0] && image[0].hasOwnProperty('path')) {
    data.imagePath = image[0].path
  }

  if (!checkProperty.empty(rawSlideData, 'birth')) {
    data.birth = '* ' + rawSlideData.birth
  } else {
    data.birth = ''
  }

  if (!checkProperty.empty(rawSlideData, 'death')) {
    data.death = '† ' + rawSlideData.death
  } else {
    data.death = ''
  }

  if (
    !checkProperty.empty(rawSlideData, 'birth') ||
    !checkProperty.empty(rawSlideData, 'death')
  ) {
    data.birthAndDeath = true
  } else {
    data.birthAndDeath = false
  }

  return data
}

/**
 * @see {@link module:@bldr/core/masters~Master#mainHTML}
 */
exports.mainHTML = function (slide, config, document) {
  const data = slide.masterData

  let birthAndDeath
  if (data.birthAndDeath) {
    birthAndDeath = `<p class="birth-and-death">${data.birth} ${data.death}</p>`
  } else {
    birthAndDeath = ''
  }

  return `
<img src="${data.imagePath}">

<div class="info-box">
  ${birthAndDeath}
  <p class="person important">${data.name}</p>
</div>`
}
