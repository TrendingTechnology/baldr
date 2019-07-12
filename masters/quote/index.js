/**
 * @file Master slide “quote”
 * @module @bldr/master-quote
 */

'use strict'

/**
 *
 */
const renderAttribution = function (author = '', date = '') {
  let comma = ''

  if (author) {
    author = `<span class="author">${author}</span>`
  }

  if (date) {
    date = `<span class="date">${date}</span>`
  }

  if (author && date) {
    comma = ', '
  }
  const attribution = author + comma + date

  if (attribution) {
    return `<p class="attribution">${attribution}</p>`
  } else {
    return ''
  }
}

/**
 *
 */
const renderQuotationMark = function (begin = true) {
  let mark = '»'
  let id = 'begin'
  if (!begin) {
    mark = '«'
    id = 'end'
  }
  return `<span id="quotation-${id}" class="quotation-mark">${mark}</span>`
}

/***********************************************************************
 * Hooks
 **********************************************************************/

exports.name = 'quote'

/**
 * @see {@link module:@bldr/core/masters~Master#config}
 */
exports.config = {
  centerVertically: true
}

/**
 * @see {@link module:@bldr/core/masters~Master#mainHTML}
 */
exports.mainHTML = function (slide, config, document) {
  const data = slide.masterData
  const attribution = renderAttribution(data.author, data.date)
  const begin = renderQuotationMark()
  const end = renderQuotationMark(false)
  return `
<section id="@bldr/master-quote">

  <p class="text">${begin} ${data.text} ${end}</p>

  ${attribution}

</section>
`
}
