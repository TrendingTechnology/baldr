import vue from '@/main.js'

/**
 * Unfortunatley it is not possible to write a Vue js component tag inline
 * in a presentation file.
 *
 *
 * # Types
 *
 * ## Media asset:
 *
 * `[id:Haydn_Joseph align="left" caption="Joseph Haydn"]`
 *
 * to:
 *
 * ```html
 * <figure class="inline-media inline-left">
 *   <img src="Haydn.jpg">
 *   <figcaption>Joseph Haydn</figcaption>
 * </figure>
 * ```
 *
 * ## Slide link:
 *
 * `[slide:one text="Slide 1"]`
 *
 * to:
 *
 * `<span b-inline-type="slide-link" b-inline-slideid="one" class="link">Slide 1</span>`
 *
 * @module @bldr/vue-app-presentation/inline-markup
 */

export function makeInlineReactive () {
  const presentation = vue.$get('presentation')
  const elements = document.querySelectorAll('[b-inline-type]')

  for (const element of elements) {
    const type = element.getAttribute('b-inline-type')
    console.log(type)

    if (type === 'slide-link') {
      const slideId = element.getAttribute('b-inline-slideid')
      element.addEventListener('click', () => {
        console.log(slideId)
        presentation.goto(slideId)
      })
    }
  }

}
