import { convertFromYaml } from '@bldr/yaml'
import { LampTypes } from '@bldr/type-definitions'
import { Resolver, Asset } from '@bldr/media-resolver'
import * as log from '@bldr/log'

import { DataCutter } from './data-management'
import { SlideCollection } from './slide-collection'
import { Slide } from './slide'

export const resolver = new Resolver()

/**
 * @inheritdoc
 */
class Meta implements LampTypes.PresentationMeta {
  /**
   * @inheritdoc
   */
  ref: string

  /**
   * @inheritdoc
   */
  uuid?: string

  /**
   * @inheritdoc
   */
  title: string

  /**
   * @inheritdoc
   */
  subtitle?: string

  /**
   * @inheritdoc
   */
  subject?: string

  /**
   * @inheritdoc
   */
  grade?: number

  /**
   * @inheritdoc
   */
  curriculum?: string

  /**
   * @inheritdoc
   */
  curriculumUrl?: string

  /**
   * The relative path containing the filename `Praesentation.baldr.yml`. This
   * attribute is present in the MongoDB records, but not in the local
   * YAML files.
   */
  path?: string

  constructor (raw: any) {
    const data = new DataCutter(raw)
    this.ref = data.cutStringNotNull('ref')
    this.uuid = data.cutString('uuid')
    this.title = data.cutStringNotNull('title')
    this.subtitle = data.cutString('subtitle')
    this.subject = data.cutString('subject')
    this.grade = data.cutNumber('grade')
    this.curriculum = data.cutString('curriculum')
    this.curriculumUrl = data.cutString('curriculumUrl')
    this.path = data.cutString('path')
    data.checkEmpty()
  }

  /**
   * Log to the console.
   */
  public log (): void {
    log.infoAny(log.formatObject(this, { indentation: 2 }))
  }
}

export class Presentation {
  public meta: Meta
  public slides: SlideCollection

  /**
   * The raw YAML string.
   */
  public rawYamlString: string

  /**
   * The raw YAML string with expanded media URI references.
   */
  public rawYamlStringExpanded?: string

  constructor (yamlString: string) {
    this.rawYamlString = yamlString
    const data = this.convertFromYaml(yamlString)
    this.meta = this.cutMeta(data)
    this.slides = new SlideCollection(data.cutNotNull('slides'))
    data.checkEmpty()
  }

  private cutMeta (data: DataCutter): Meta {
    const meta = data.cutAny('meta')
    const title = data.cutString('title')
    const ref = data.cutString('ref')

    if (meta != null && (title != null || ref != null)) {
      throw new Error(
        'Specify the “title” or “ref” inside or outside of the “meta” property not both!'
      )
    }

    if (meta != null) {
      return new Meta(meta)
    }

    if (title == null || ref == null) {
      throw new Error('Specify both title and ref!')
    }

    return new Meta({ title, ref })
  }

  /**
   * Merge two sources to build a presentation from. A the moment only the
   * meta.path property is taken from the raw presentation object.
   *
   * @param yamlString - The presentation as a YAML string
   * @param raw - A raw presentation object (as stored in the MongoDB).
   *
   * @returns A newly created presentation.
   */
  public static mergeYamlStringWithRaw (yamlString: string, raw?: any): Presentation {
    const presentation = new Presentation(yamlString)
    if (raw?.meta?.path != null && presentation.meta.path == null) {
      presentation.meta.path = raw.meta.path
    }
    return presentation
  }

  /**
   * Media URIs in the “ref” can be shorted with the string `./`. The
   * abbreviationn `./` is replaced with the presentation reference and a
   * underscore, for example the media URI
   * `ref:Leitmotivtechnik_VD_Verdeutlichung_Duell-Mundharmonika-Frank` can be
   * shortend with `ref:./VD_Verdeutlichung_Duell-Mundharmonika-Frank`. The
   * abbreviationn `./` is inspired by the UNIX dot notation for the current
   * directory.
   *
   * @param rawYamlString - The raw YAML string of the presentation file.
   * @param metaRef - The reference of the presentation.
   *
   * @returns A raw YAML string with fully expanded media URIs.
   */
  private expandMediaRefs (rawYamlString: string, metaRef: string): string {
    return rawYamlString.replace(/ref:.\//g, `ref:${metaRef}_`)
  }

  /**
   * Convert the raw YAML string into javascript object.
   *
   * @param rawYamlString - The raw YAML string of the presentation file.
   *
   * @returns A data cutter object.
   *
   * @throws {Error} If the media URI references cannot be resolved.
   */
  private convertFromYaml (yamlString: string): DataCutter {
    let raw = convertFromYaml(yamlString)
    if (yamlString.includes('ref:./')) {
      let ref: string | undefined
      if (raw.ref != null) {
        ref = raw.ref
      }
      if (raw.meta?.ref != null) {
        ref = raw.meta.ref
      }
      if (ref == null) {
        throw new Error(
          'A reference abbreviation was found, but the presentation has no reference meta information.'
        )
      }
      yamlString = this.expandMediaRefs(yamlString, ref)
      this.rawYamlStringExpanded = yamlString
      raw = convertFromYaml(yamlString)
    }
    return new DataCutter(raw)
  }

  /**
   * The relative path of parent directory, for example
   * `12/20_Tradition/10_Umgang-Tradition/10_Futurismus`.
   */
  public get parentDir (): string | undefined {
    if (this.meta.path != null) {
      return this.meta.path.replace(/\/[^/]*\.baldr\.yml/, '')
    }
  }

  public async resolve (): Promise<Asset[]> {
    let assets = await resolver.resolve(this.slides.mediaUris, true)
    assets = assets.concat(
      await resolver.resolve(this.slides.optionalMediaUris, false)
    )

    for (const slide of this.slides) {
      slide.master.finalizeSlide(slide, resolver)
    }

    return assets
  }

  /**
   * The first slide of a presentation. It is equivalent to
   * `presentation.slides.flat[0]`.
   */
  public get firstSlide (): Slide {
    return this.slides.flat[0]
  }

  /**
   * @param no - Slide number starting from 1
   */
  public getSlideByNo (no: number): Slide {
    return this.slides.flat[no - 1]
  }

  /**
   * @param ref - The slide reference.
   *
   * ```yml
   * - ref: reference
   *   generic: slide
   * ```
   */
  public getSlideByRef (ref: string): Slide | undefined {
    if (this.slides.withRef[ref] != null) {
      return this.slides.withRef[ref]
    }
  }

  /**
   * Log to the console.
   */
  public log (): void {
    this.meta.log()
    for (const slide of this.slides.flat) {
      slide.log()
    }

    const assets = resolver.exportAssets(this.slides.mediaUris)
    for (const asset of assets) {
      log.verboseAny(log.formatObject(asset.meta, { keys: ['title', 'ref'] }))
    }
  }
}
