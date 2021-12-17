import { DeepTitle } from '@bldr/titles'
import { LampTypes } from '@bldr/type-definitions'

import { Builder, MediaData } from './builder'

export interface PresentationData extends MediaData, LampTypes.FileFormat {}

export interface DbPresentationData extends PresentationData {

}

export class PresentationBuilder extends Builder {
  data: PresentationData

  constructor (filePath: string) {
    super(filePath)

    const data: Record<string, any> = {}

    this.importYamlFile(this.absPath, data)

    if (data.slides == null) {
      throw new Error('No slide property.')
    }

    this.data = {
      relPath: this.relPath,
      slides: data.slides
    }
  }

  public enrichMetaProp (): PresentationBuilder {
    const title = new DeepTitle(this.absPath)
    const meta = title.generatePresetationMeta()

    if (this.data.meta == null) {
      this.data.meta = meta
    } else {
      if (meta?.ref == null) {
        this.data.meta.ref = meta.ref
      }
      if (meta?.title == null) {
        this.data.meta.title = meta.title
      }
      if (meta?.subtitle == null) {
        this.data.meta.subtitle = meta.subtitle
      }
      if (meta?.curriculum == null) {
        this.data.meta.curriculum = meta.curriculum
      }
      if (meta?.grade == null) {
        this.data.meta.grade = meta.grade
      }
    }
    return this
  }

  public build (): PresentationData {
    this.enrichMetaProp()
    return this.data
  }

  public buildForDb (): DbPresentationData {
    this.enrichMetaProp()
    return this.data as DbPresentationData
  }
}
