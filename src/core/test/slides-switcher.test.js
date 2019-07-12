const {
  assert,
  requireFile,
  freshEnv
} = require('@bldr/test-helper')

const { getSlides } = requireFile('@bldr/core', 'slides.js')
const { SlidesSwitcher } = requireFile('@bldr/core', 'slides-switcher.js')

const env = freshEnv()
const slides = getSlides(env)
const slidesSwitcher = new SlidesSwitcher(slides, env)

/***********************************************************************
 *
 **********************************************************************/

describe('Class “SlidesSwitcher()” #unittest', () => {
  describe('Properties', () => {
    it('Property “this.slides”', () => {
      assert.equal(slidesSwitcher.slides[1].no, 1)
    })

    it('Property “this.count”', () => {
      assert.equal(slidesSwitcher.count, 3)
    })

    it('Property “this.no”', () => {
      assert.equal(slidesSwitcher.no, 1)
    })

    it('Property “this.document”', () => {
      assert.equal(typeof slidesSwitcher.env.document, 'object')
    })

    it('Property “this.elemNavigationButtons.prev”', () => {
      assert.equal(
        slidesSwitcher.elemNavigationButtons.prev.id,
        'nav-slide-prev'
      )
    })

    it('Property “this.elemNavigationButtons.next”', () => {
      assert.equal(
        slidesSwitcher.elemNavigationButtons.next.id,
        'nav-slide-next'
      )
    })
  })

  describe('Methods', () => {
    it('Method “getByNo()”', () => {
      const slide = slidesSwitcher.getByNo(2)
      assert.equal(slide.no, 2)
    })

    it('Method “prev()”', () => {
      const slide = slidesSwitcher.prev()
      assert.equal(slide.no, 3)
    })

    it('Method “next()”', () => {
      const slide = slidesSwitcher.next()
      assert.equal(slide.no, 1)
    })
  })
})
