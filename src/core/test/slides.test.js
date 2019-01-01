const {
  assert,
  rewire,
  srcPath,
  freshEnv
} = require('@bldr/test-helper')

let slidesJsPath = srcPath('core', 'slides.js')
const { Slide } = require(slidesJsPath)
const Slides = rewire(slidesJsPath).__get__('Slides')
const SlideData = rewire(slidesJsPath).__get__('SlideData')

let slide

/***********************************************************************
 *
 **********************************************************************/

describe('Class “SlideData()” #unittest', () => {
  let getInput = function (rawSlideData) {
    return new SlideData(rawSlideData, freshEnv())
  }
  let input = getInput({ markdown: 'text' })

  describe('Instantiation', () => {
    describe('Valid input on “rawSlideData”', () => {
      it('String', () => {
        let input = getInput('camera')
        assert.equal(input.masterName, 'camera')
        assert.equal(input.rawMasterData, true)
        assert.equal(input.themeName, false)
      })

      it('Object: only master property', () => {
        let input = getInput({ 'camera': true })
        assert.equal(input.masterName, 'camera')
        assert.equal(input.rawMasterData, true)
        assert.equal(input.themeName, false)
      })

      it('Object: only master property', () => {
        let input = getInput({ camera: true, theme: 'default' })
        assert.equal(input.masterName, 'camera')
        assert.equal(input.rawMasterData, true)
        assert.equal(input.themeName, 'default')
      })
    })

    describe('Invalid input on “rawSlideData”', () => {
      it('Invalid string', () => {
        assert.throws(
          () => { getInput('cmr') },
          /Error: Unknown master “cmr” specified as string/
        )
      })

      it('Unsupported types', () => {
        assert.throws(
          () => { getInput(['lol']) },
          /Error: Unsupported input type “array” on input data: lol/
        )
        assert.throws(
          () => { getInput(42) },
          /Error: Unsupported input type “number” on input data: 42/
        )
      })

      it('undefined', () => {
        assert.throws(
          () => { getInput(undefined) },
          /Error: Unsupported input type “undefined” on input data: undefined/
        )
      })

      it('Two master slide properties', () => {
        assert.throws(
          () => { getInput({ audio: true, camera: true }) },
          /Error: Each slide must have only one master slide: {"audio":true,"camera":true}/
        )
      })

      it('No master slide properties', () => {
        assert.throws(
          () => { getInput({ lol: true, troll: true }) },
          /Error: No master slide found: {"lol":true,"troll":true}/
        )
      })

      it('Wrong theme', () => {
        assert.throws(
          () => { getInput({ camera: true, theme: 'lol' }) },
          /Error: Unkown theme: “lol”/
        )
      })

      it('Unkown slide properties', () => {
        assert.throws(
          () => { getInput({ camera: true, lol: 'lol' }) },
          /Error: Unknown slide properties: {"lol":"lol"}/
        )
      })
    })
  })

  describe('Methods', () => {
    describe('Method “intersect_()”', () => {
      it('One intersection', () => {
        assert.deepEqual(
          input.intersect_(['one', 'two', 'three'], ['two']),
          ['two']
        )
      })

      it('No intersection', () => {
        assert.deepEqual(
          input.intersect_(['one', 'two', 'three'], ['four']),
          []
        )
      })

      it('Multiple intersections', () => {
        assert.deepEqual(
          input.intersect_(['one', 'two', 'three'], ['one', 'two', 'three']),
          ['one', 'two', 'three']
        )
      })

      it('Reverse order', () => {
        assert.deepEqual(
          input.intersect_(['one', 'two', 'three'], ['three', 'two', 'one']),
          ['one', 'two', 'three']
        )
      })
    })

    describe('Method “toString_()”', () => {
      it('string', () => {
        assert.equal(input.toString_('lol'), 'lol')
      })

      it('array', () => {
        assert.equal(input.toString_(['lol', 'troll']), 'lol,troll')
      })

      it('object', () => {
        assert.equal(input.toString_({ lol: 'troll' }), '{"lol":"troll"}')
      })

      it('undefined', () => {
        assert.equal(input.toString_(undefined), 'undefined')
      })

      it('null', () => {
        assert.equal(input.toString_(null), 'null')
      })
    })

    describe('Method “getType_()”', () => {
      it('object', () => {
        assert.equal(input.getType_({}), 'object')
        assert.equal(input.getType_({ markdown: 'lol' }), 'object')
      })

      it('array', () => {
        assert.equal(input.getType_([]), 'array')
        assert.equal(input.getType_(['lol', 'troll']), 'array')
      })

      it('string', () => {
        assert.equal(input.getType_('lol'), 'string')
      })

      it('null', () => {
        assert.equal(input.getType_(null), 'null')
      })

      it('undefined', () => {
        assert.equal(input.getType_(undefined), 'undefined')
      })

      it('number', () => {
        assert.equal(input.getType_(1), 'number')
      })
    })
  })
})
/***********************************************************************
 *
 **********************************************************************/

describe('Class “Slide()” #unittest', () => {
  beforeEach(() => {
    slide = new Slide({
      'question': [
        {
          'question': 'question',
          'answer': 'answer'
        }
      ] },
    freshEnv()
    )
  })

  describe('Properties', () => {
    it('Property “this.master”', () => {
      assert.equal(slide.master.name, 'question')
    })

    it('Property “this.slideData.rawMasterData', () => {
      assert.equal(slide.slideData.rawMasterData[0].question, 'question')
    })

    it('Property “this.masterData”', () => {
      assert.equal(slide.masterData[0].question, 'question')
    })

    it('Property “this.steps”', () => {
      assert.equal(slide.steps.constructor.name, 'StepSwitcher')
    })

    it('Property “this.steps”', () => {
      assert.equal(slide.steps.visited, false)
      slide.set()
      assert.equal(slide.steps.visited, true)
    })

    it('Property “this.document”', function () {
      assert.equal(typeof slide.env.document, 'object')
    })

    it('Property “this.elements.slide”', function () {
      assert.equal(slide.elements.slide.id, 'slide-content')
      assert.equal(slide.elements.slide.nodeName, 'DIV')
      assert.equal(slide.elements.slide.nodeType, 1)
    })

    it('Property “this.elements.modal”', function () {
      assert.equal(slide.elements.modal.id, 'modal-content')
      assert.equal(slide.elements.modal.nodeName, 'DIV')
      assert.equal(slide.elements.modal.nodeType, 1)
    })

    it('Property “this.cover”', () => {
      assert.equal(slide.cover.id, 'cover')
      assert.equal(slide.cover.nodeName, 'DIV')
    })
  })

  describe('Methods', () => {
    it('Method “setCover_()”', () => {
      slide.setCover_('red', 99)
      let cover = slide.env.document.getElementById('cover')
      assert.equal(cover.style.backgroundColor, 'red')
      assert.equal(cover.style.zIndex, 99)
    })

    it('Method “set()”', function () {
      slide.set()
      assert.equal(
        slide.env.document.querySelector('p:nth-child(1)').textContent,
        'question'
      )

      assert.equal(slide.cover.style.backgroundColor, 'black')
      assert.ok(slide.elements.slide.textContent.includes('question'))
    })
  })

  describe('Method “setDataset_()”', () => {
    let env = freshEnv()

    let slide = new Slide({
      'question': [
        {
          'question': 'question',
          'answer': 'answer'
        }
      ] },
    env
    )

    slide.setDataset_()

    it('centerVertically: <body data-center-vertically="true">', function () {
      assert.equal(env.document.body.dataset.centerVertically, 'true')
    })

    it('margin: <body data-margin="true">', function () {
      assert.equal(env.document.body.dataset.margin, 'true')
    })

    it('master: <body data-master="masterName">', function () {
      assert.equal(env.document.body.dataset.master, 'question')
    })

    it('theme: <body data-theme="default">', function () {
      assert.equal(env.document.body.dataset.theme, 'default')
    })
  })
})

let slidesClass

/***********************************************************************
 *
 **********************************************************************/

describe('Class “Slides()”', () => {
  beforeEach(() => {
    slidesClass = new Slides(freshEnv())
  })

  describe('Properties', () => {
    it('Property “this.rawSlides”', () => {
      assert.equal(typeof slidesClass.rawSlides, 'object')
      assert.equal(slidesClass.rawSlides[0].quote.author, 'Johann Wolfgang von Goethe')
    })

    it('Property “this.document”', () => {
      assert.equal(typeof slidesClass.env.document, 'object')
      assert.equal(slidesClass.env.document.body.nodeName, 'BODY')
    })
  })

  describe('Methods', () => {
    it('Method “get()”', () => {
      let result = slidesClass.get()
      assert.equal(result[1].master.name, 'quote')
      assert.equal(result[2].master.name, 'question')
      assert.equal(result[3].master.name, 'person')
    })
  })
})
