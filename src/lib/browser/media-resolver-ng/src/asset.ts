import { Sample, SampleYamlFormat, Asset, YamlFormat, RestApiRaw } from './types'

import {
  getExtension,
  formatMultiPartAssetFileName
} from '@bldr/core-browser'
import { mimeTypeManager, MediaUri } from '@bldr/client-media-models'

import { Cache } from './cache'
import { SampleData } from './sample'

export class SampleCollection extends Cache<Sample> {
  private readonly asset: Asset

  constructor (asset: Asset) {
    super()
    this.asset = asset
    this.addFromAsset(asset)
  }

  get complete (): Sample | undefined {
    return this.get(this.asset.ref + '#complete')
  }

  private addSample (
    asset: Asset,
    yamlFormat: SampleYamlFormat
  ): void {
    const sample = new SampleData(asset, yamlFormat)
    if (this.get(sample.ref) == null) {
      this.add(sample.ref, sample)
    }
  }

  /**
   * Gather informations to build the default sample “complete”.
   */
  private gatherYamlFromRoot (
    assetFormat: YamlFormat
  ): SampleYamlFormat | undefined {
    const yamlFormat: SampleYamlFormat = {}
    if (assetFormat.startTime != null) {
      yamlFormat.startTime = assetFormat.startTime
    }
    if (assetFormat.duration != null) {
      yamlFormat.duration = assetFormat.duration
    }
    if (assetFormat.endTime != null) {
      yamlFormat.endTime = assetFormat.endTime
    }
    if (assetFormat.fadeIn != null) {
      yamlFormat.startTime = assetFormat.fadeIn
    }
    if (assetFormat.fadeOut != null) {
      yamlFormat.startTime = assetFormat.fadeOut
    }
    if (assetFormat.shortcut != null) {
      yamlFormat.shortcut = assetFormat.shortcut
    }
    if (Object.keys(yamlFormat).length > 0) {
      return yamlFormat
    }
  }

  private addFromAsset (asset: Asset): void {
    // search the “complete” sample from the property “samples”.
    let completeYamlFromSamples: SampleYamlFormat | undefined
    if (asset.yaml.samples != null) {
      for (let i = 0; i < asset.yaml.samples.length; i++) {
        const sampleYaml = asset.yaml.samples[i]
        if (sampleYaml.ref != null && sampleYaml.ref === 'complete') {
          completeYamlFromSamples = sampleYaml
          asset.yaml.samples.splice(i, 1)
          break
        }
      }
    }

    // First add default sample “complete”
    const completeYamlFromRoot = this.gatherYamlFromRoot(asset.yaml)

    if (completeYamlFromSamples != null && completeYamlFromRoot != null) {
      throw new Error('Duplicate definition of the default complete sample')
    } else if (completeYamlFromSamples != null) {
      this.addSample(asset, completeYamlFromSamples)
    } else if (completeYamlFromRoot != null) {
      this.addSample(asset, completeYamlFromRoot)
    } else {
      this.addSample(asset, {})
    }

    let counter = 0

    // Add samples from the YAML property “samples”
    if (asset.yaml.samples != null) {
      for (const sampleSpec of asset.yaml.samples) {
        if (sampleSpec.ref == null && sampleSpec.title == null) {
          counter++
          sampleSpec.ref = `sample${counter}`
          sampleSpec.title = `Ausschnitt ${counter}`
        }
        this.addSample(asset, sampleSpec)
      }
    }
  }
}

export class ClientMediaAsset implements Asset {
  /**
   * @inheritdoc
   */
  yaml: RestApiRaw
  uri: MediaUri

  /**
   * The keyboard shortcut to launch the media asset. At the moment only used by
   * images.
   */
  private shortcut_?: string

  samples?: SampleCollection

  /**
   * @inheritdoc
   */
  mimeType: string

  /**
   * @inheritdoc
   */
  httpUrl: string

  /**
   * @param yaml - A raw javascript object read from the Rest API
   */
  constructor (
    uri: string,
    httpUrl: string,
    yaml: RestApiRaw
  ) {
    this.uri = new MediaUri(uri)
    this.httpUrl = httpUrl

    this.yaml = yaml

    if (this.yaml.extension == null && this.yaml.filename != null) {
      const extension = getExtension(this.yaml.filename)
      if (extension != null) {
        this.yaml.extension = extension
      }
    }

    if (this.yaml.extension == null) {
      throw Error('The client media assets needs a extension')
    }

    this.mimeType = mimeTypeManager.extensionToType(this.yaml.extension)

    if (this.isPlayable) {
      this.samples = new SampleCollection(this as Asset)
    }
  }

  /**
   * @inheritdoc
   */
  get ref (): string {
    return 'ref:' + this.yaml.ref
  }

  /**
   * @inheritdoc
   */
  get uuid (): string {
    return 'uuid:' + this.yaml.uuid
  }

  set shortcut (value: string | undefined) {
    this.shortcut_ = value
  }

  /**
   * @inheritdoc
   */
  get shortcut (): string | undefined {
    if (this.shortcut_ != null) {
      return this.shortcut_
    }
  }

  /**
   * @inheritdoc
   */
  get previewHttpUrl (): string | undefined {
    if (this.yaml.previewImage) {
      return `${this.httpUrl}_preview.jpg`
    }
  }

  /**
   * @inheritdoc
   */
  get waveformHttpUrl (): string | undefined {
    if (this.yaml.hasWaveform) {
      return `${this.httpUrl}_waveform.png`
    }
  }

  get titleSafe (): string {
    if (this.yaml.title != null) {
      return this.yaml.title
    }
    if (this.yaml.filename != null) {
      return this.yaml.filename
    }
    return this.uri.raw
  }

  /**
   * @inheritdoc
   */
  get isPlayable (): boolean {
    return ['audio', 'video'].includes(this.mimeType)
  }

  /**
   * @inheritdoc
   */
  get isVisible (): boolean {
    return ['image', 'video'].includes(this.mimeType)
  }

  /**
   * @inheritdoc
   */
  get multiPartCount (): number {
    if (this.yaml.multiPartCount == null) {
      return 1
    }
    return this.yaml.multiPartCount
  }

  /**
   * @inheritdoc
   */
  getMultiPartHttpUrlByNo (no: number): string {
    if (this.multiPartCount === 1) return this.httpUrl
    if (no > this.multiPartCount) {
      throw new Error(
        `The asset has only ${this.multiPartCount} parts, not ${no}`
      )
    }
    return formatMultiPartAssetFileName(this.httpUrl, no)
  }
}