import { DataCutter } from './data-management'
import { convertToString } from '@bldr/core-browser'
import { masterCollection } from './master-collection'
import { MasterWrapper, FieldData } from './master'
import { WrappedUriList } from './fuzzy-uri'
import { Step, StepCollector } from './step'
import * as log from '@bldr/log'

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

  public readonly master: MasterWrapper

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
    // data.checkEmpty()
  }

  private detectMaster (data: DataCutter): MasterWrapper {
    const masterNames = Object.keys(masterCollection)
    const intersection = masterNames.filter(masterName =>
      data.keys.includes(masterName)
    )

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
   * If the slide has no steps, then the array remains empty.
   */
  public get steps (): Step[] {
    return this.stepCollector.steps
  }

  /**
   * Log to the console.
   */
  public log (): void {
    const unicodeSymbol =
      this.master.icon.unicodeSymbol != null
        ? this.master.icon.unicodeSymbol + '\t'
        : '\t'
    log.always('%sSlide No. %s', [unicodeSymbol, this.no])
  }
}
