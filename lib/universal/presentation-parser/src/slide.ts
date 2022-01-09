import { convertToString } from '@bldr/core-browser'
import { shortenText } from '@bldr/string-format'
import * as log from '@bldr/log'
import { WrappedUriList } from '@bldr/client-media-models'
import { getConfig } from '@bldr/config'

import { DataCutter } from './data-management'
import { masterCollection } from './master-collection'
import { FieldData } from './master-specification'
import { Master } from './master-wrapper'
import { Step, StepCollector } from './step'

const config = getConfig()

/**
 * The meta data of a slide. Each slide object owns one meta data object.
 */
class SlideMeta {
  /**
   * The ID of a slide (Used for links)
   */
  public readonly ref?: string

  /**
   * The title of a slide.
   */
  public readonly title?: string

  /**
   * Some text that describes the slide.
   */
  public readonly description?: string

  /**
   * The source of the slide, for example a HTTP URL.
   */
  public readonly source?: string

  /**
   * @param {Object} rawSlideObject
   */
  constructor (data: DataCutter) {
    this.ref = data.cutString('ref')
    this.title = data.cutString('title')
    this.description = data.cutString('description')
    this.source = data.cutString('source')
  }
}

export class Slide {
  /**
   * The slide number
   */
  public no: number

  /**
   * The level in the hierarchial slide tree.
   */
  public level: number

  /**
   * An array of child slide objects.
   */
  public slides?: Slide[]

  public stepCollector: StepCollector = new StepCollector()

  public readonly meta: SlideMeta

  public readonly master: Master

  /**
   * In this attribute we save the normalized field data of a slide.
   */
  fields?: FieldData

  /**
   * URIs of media assets that must necessarily be present.
   */
  public readonly mediaUris: Set<string>

  /**
   * URIs of media assets that do not have to exist.
   */
  public readonly optionalMediaUris: Set<string>

  public readonly audioOverlay?: WrappedUriList

  /**
   * The scale factor is used to calculate the font size css style property of
   * the root element in the component
   * `src/vue/apps/lamp/src/components/linked-by-routes/SlideView/index.vue`
   */
  public scaleFactor = 1

  /**
   * Css properties in camelCase for the style property of the vue js
   * render function.
   *
   * ```yml
   * - title: Different background color
   *   task: Background color blue
   *   style:
   *     background_color: $green;
   *     color: $blue;
   *     font_size: 8vw
   *     font_weight: bold
   * ```
   *
   * This attribute is used in the lamp app in this components:
   *
   * `components/reusable/SlideMain/MasterRenderer.vue`:
   * `<masterName-master-main :style="slide.cssStyle" />`
   *
   * `components/reusable/SlidesPreview/SlidePreviewRenderer.vue`
   * `<masterName-master-preview :style="slide.cssStyle" />`
   *
   * @see {@link https://vuejs.org/v2/guide/class-and-style.html#Object-Syntax-1}
   */
  cssStyle?: Record<string, string>

  constructor (raw: any, no: number, level: number) {
    this.no = no
    this.level = level
    const data = new DataCutter(raw)
    this.meta = new SlideMeta(data)
    this.master = this.detectMaster(data)
    this.fields = this.master.initializeFields(data.cutAny(this.master.name))
    this.mediaUris = this.master.processMediaUris(this.fields)
    this.optionalMediaUris = this.master.processOptionalMediaUris(this.fields)
    this.master.collectStepsOnInstantiation(this.fields, this.stepCollector)
    this.audioOverlay = this.parseAudioOverlay(data)

    const style = data.cutAny('style')
    if (style != null) {
      this.cssStyle = this.normalizeCssStyle(style)
    }
    // data.checkEmpty()
  }

  private detectMaster (data: DataCutter): Master {
    const masterNames = Object.keys(masterCollection)
    const intersection = masterNames.filter(masterName =>
      data.keys.includes(masterName)
    )

    // - camera
    if (typeof data.raw === 'string' && masterNames.includes(data.raw)) {
      return masterCollection[data.raw]
    }

    if (intersection.length === 0) {
      throw new Error(`No master slide found: ${convertToString(data.raw)}`)
    }

    if (intersection.length > 1) {
      throw new Error(
        `Each slide must have only one master slide: ${convertToString(
          data.raw
        )}`
      )
    }

    return masterCollection[intersection[0]]
  }

  private parseAudioOverlay (data: DataCutter): WrappedUriList | undefined {
    const audioOverlay = data.cutAny('audioOverlay')
    if (audioOverlay != null) {
      return new WrappedUriList(audioOverlay)
    }
  }

  /**
   * Normalize (replace SASS variables, remove “;” at the end of the entries) a
   * style object.
   *
   * @param style - The raw style object from the YAML format.
   *
   * @returns The normalized CSS style object, for example
   *
   * ```js
   * {
   *   backgroundColor: '#4e79a7',
   *   color: '#59a14e'
   * }
   * ```
   */
  private normalizeCssStyle (
    style: Record<string, string>
  ): Record<string, string> {
    /**
     * Compile a Sass string to a CSS string.
     *
     * @see {@link https://stackoverflow.com/a/34725742/10193818 Stackoverflow}
     */
    function compileToCss (sass: string): string {
      const output = sass.replace(/;$/, '')
      return output.replace(/(\$[a-zA-Z0-9-]+)/g, function (
        match: string
      ): string {
        return config.sassVariables[match]
      })
    }

    for (const property in style) {
      style[property] = compileToCss(style[property])
    }
    return style
  }

  /**
   * If the slide has no steps, then the array remains empty.
   */
  public get steps (): Step[] {
    return this.stepCollector.steps
  }

  public get plainText (): string | undefined {
    return this.master.derivePlainTextFromFields(this.fields)
  }

  /**
   * The title of the slide. The HTML tags are removed. First the metadata field
   * `title` (`- title: Title`) is used, then a string obtained from the master
   * hook `deriveTitleFromFields`, then the getter `this.plainText` and finally
   * the master name.
   */
  public get title (): string {
    if (this.meta.title != null) {
      return shortenText(this.meta.title, { stripTags: true })
    }

    const titleFromFields = this.master.deriveTitleFromFields(this.fields)

    if (titleFromFields != null) {
      return shortenText(titleFromFields, { stripTags: true })
    }

    const plainText = this.plainText
    if (plainText != null) {
      return shortenText(plainText, { stripTags: true })
    }

    return this.master.displayName
  }

  /**
   *
   */
  public get detailedTitle (): string {
    return `Nr. ${this.no} [${this.master.displayName}]: ${this.title}`
  }

  /**
   * Log to the console.
   */
  public log (): void {
    const unicodeSymbol =
      this.master.icon.unicodeSymbol != null
        ? this.master.icon.unicodeSymbol + '\t'
        : '\t'
    log.info('%s%s', [unicodeSymbol, this.detailedTitle])

    for (const step of this.steps) {
      log.verbose('\t\tNr. %s: %s', [step.no, step.title])
    }
  }
}
