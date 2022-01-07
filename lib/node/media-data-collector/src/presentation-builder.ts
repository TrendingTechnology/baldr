import { DeepTitle } from '@bldr/titles'
import { MediaDataTypes } from '@bldr/type-definitions'

import { Builder } from './builder'

export class PresentationBuilder extends Builder {
  data: MediaDataTypes.PresentationData

  constructor (filePath: string) {
    super(filePath)

    const data: Record<string, any> = {}

    this.importYamlFile(this.absPath, data)

    if (data.meta == null) {
      throw new Error(
        `The presentation “${this.absPath}” needs a property named “meta”.`
      )
    }

    if (data.slides == null) {
      throw new Error(
        `The presentation “${this.absPath}” needs a property named “slide”.`
      )
    }

    this.data = {
      meta: data.meta,
      slides: data.slides
    }

    this.data.meta.path = this.relPath
  }

  public enrichMetaProp (): PresentationBuilder {
    const title = new DeepTitle(this.absPath)
    const meta = title.generatePresetationMeta()
    if (this.data.meta.ref == null && meta.ref != null) {
      this.data.meta.ref = meta.ref
    }
    if (this.data.meta.title == null && meta.title != null) {
      this.data.meta.title = meta.title
    }
    if (this.data.meta.subtitle == null && meta.subtitle != null) {
      this.data.meta.subtitle = meta.subtitle
    }
    if (this.data.meta.subject == null && meta.subject != null) {
      this.data.meta.subject = meta.subject
    }
    if (this.data.meta.grade == null && meta.grade != null) {
      this.data.meta.grade = meta.grade
    }
    if (this.data.meta.curriculum == null && meta.curriculum != null) {
      this.data.meta.curriculum = meta.curriculum
    }
    return this
  }

  public build (): MediaDataTypes.PresentationData {
    this.enrichMetaProp()
    return this.data
  }
}
