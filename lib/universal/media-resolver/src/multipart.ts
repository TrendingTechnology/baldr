import { Asset, Identifiable } from './asset'
import { buildSubsetIndexes } from '@bldr/core-browser'
import { MediaDataTypes } from '@bldr/type-definitions'

/**
 * A multipart asset can be restricted in different ways. This class holds the
 * data of the restriction (for example all parts, only a single part, a
 * subset of parts). A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
export class MultipartSelection implements Identifiable {
  private readonly selectionSpec: string
  public asset: Asset
  private readonly partNos: number[]

  /**
   * @param selectionSpec - Can be a URI, everthing after `#`, for
   * example `ref:Song-2#2-5` -> `2-5`
   */
  constructor (asset: Asset, selectionSpec: string) {
    this.selectionSpec = selectionSpec.replace(/^.*#/, '')

    this.asset = asset

    this.partNos = buildSubsetIndexes(
      this.selectionSpec,
      this.asset.multiPartCount,
      0
    )
  }

  get ref (): string {
    return `${this.asset.ref}#${this.selectionSpec}`
  }

  get uuid (): string {
    return `${this.asset.uuid}#${this.selectionSpec}`
  }

  /**
   * We imitate the class “Asset”. ExternalSites.vue requires .meta.
   */
  get meta (): MediaDataTypes.AssetMetaData {
    return this.asset.meta
  }

  /**
   * The number of parts of a multipart media asset.
   */
  get multiPartCount (): number {
    return this.partNos.length
  }

  /**
   * Used for the preview to fake that this class is a normal asset.
   */
  get httpUrl (): string {
    return this.getMultiPartHttpUrlByNo(1)
  }

  /**
   * Retrieve the HTTP URL of the multi part asset by the part number.
   *
   * @param The part number starts with 1. We set a default value,
   * because no is sometimes undefined when only one part is selected. The
   * router then creates no step url (not /slide/1/step/1) but (/slide/1)
   */
  getMultiPartHttpUrlByNo (no = 1): string {
    return this.asset.getMultiPartHttpUrlByNo(this.partNos[no - 1])
  }
}
