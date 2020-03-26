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
 * `<span b-inline-type="slide-link" b-inline-slideid="one">Slide 1</span>`
 *
 * @module @bldr/vue-app-presentation/inline-markup
 */
