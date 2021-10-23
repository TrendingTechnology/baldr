import { MediaUri } from '@bldr/client-media-models'
import { MediaResolverTypes } from '@bldr/type-definitions'

/**
 * This class manages the counter for one MIME type (`audio`, `image` and `video`).
 */
class MimeTypeShortcutCounter {
  /**
   * `a` for audio files and `v` for video files.
   */
  private readonly triggerKey: string

  private count: number

  constructor (triggerKey: string) {
    this.triggerKey = triggerKey
    this.count = 0
  }

  /**
   * Get the next available shortcut: `a 1`, `a 2`
   */
  get (): string | undefined {
    if (this.count < 10) {
      this.count++
      if (this.count === 10) {
        return `${this.triggerKey} 0`
      }
      return `${this.triggerKey} ${this.count}`
    }
  }

  reset (): void {
    this.count = 0
  }
}

class Cache<T> implements MediaResolverTypes.Cache<T> {
  protected cache: { [ref: string]: T }
  constructor () {
    this.cache = {}
  }

  add (ref: string, mediaObject: T): boolean {
    if (this.cache[ref] == null) {
      this.cache[ref] = mediaObject
      return true
    }
    return false
  }

  get (ref: string): T | undefined {
    if (this.cache[ref] != null) {
      return this.cache[ref]
    }
  }

  /**
   * The size of the cache. Indicates how many media objects are in the cache.
   */
  get size (): number {
    return Object.keys(this.cache).length
  }

  getAll (): T[] {
    return Object.values(this.cache)
  }

  reset (): void {
    for (const ref in this.cache) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.cache[ref]
    }
  }

  * [Symbol.iterator] (): Generator<T, any, any> {
    for (const ref in this.cache) {
      yield this.cache[ref]
    }
  }
}

/**
 * Media assets have two URI schemes: `uuid:` and `ref:`. Internally we use only
 * the `ref` scheme. This cache enables the translation from `uuid` to `ref`
 * URIs.
 */
export class MediaUriTranslator {
  private uuids: { [uuid: string]: string }

  constructor () {
    this.uuids = {}
  }

  /**
   *
   * @param ref The authority in the reference (`ref`) scheme. The prefixed
   *   scheme can be omitted.
   * @param uuid The authority in the Universally Unique Identifier (`uuid`)
   *   scheme. The prefixed scheme can be omitted.
   *
   * @returns True, if the uri authority pair was successfully added, false
   *   if the pair was already added.
   */
  addPair (ref: string, uuid: string): boolean {
    ref = MediaUri.removeScheme(ref)
    uuid = MediaUri.removeScheme(uuid)
    if (this.uuids[uuid] == null) {
      this.uuids[uuid] = ref
      return true
    }
    return false
  }

  /**
   * Get the reference authority from the Universally Unique Identifier (uuid)
   * authority. The input must be specified without the scheme prefixes and the
   * output is prefixed with the `ref:` scheme.
   *
   * @param uuid With out the scheme prefix.
   *
   * @returns The reference authority with `ref:`
   */
  private getRefFromUuid (uuid: string): string | undefined {
    uuid = MediaUri.removeScheme(uuid)
    if (this.uuids[uuid] != null) {
      return 'ref:' + this.uuids[uuid]
    }
  }

  /**
   * Get the fully qualified media URI using the reference `ref` scheme. A URI
   * specified with `uuid` is converted to the `ref` scheme. A fragment
   * `#fragment` can be specified.
   *
   * @param uuidOrRef Scheme prefix is required, for example `ref:Mozart` or
   * `uuid:…`
   *
   * @returns A fully qualified media URI using the reference `ref` scheme, for
   * example `ref:Alla-Turca#complete`
   */
  getRef (
    uuidOrRef: string,
    withoutFragment: boolean = false
  ): string | undefined {
    let prefix: string | undefined
    const splittedUri = MediaUri.splitByFragment(uuidOrRef)
    if (splittedUri.prefix.indexOf('uuid:') === 0) {
      prefix = this.getRefFromUuid(splittedUri.prefix)
    } else {
      prefix = splittedUri.prefix
    }
    if (prefix != null) {
      if (splittedUri.fragment == null || withoutFragment) {
        return prefix
      } else {
        return `${prefix}#${splittedUri.fragment}`
      }
    }
  }

  reset (): void {
    for (const uuid in this.uuids) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.uuids[uuid]
    }
  }
}

export class AssetCache extends Cache<MediaResolverTypes.ClientMediaAsset> {
  mediaUriTranslator: MediaUriTranslator
  constructor (translator: MediaUriTranslator) {
    super()
    this.mediaUriTranslator = translator
  }
  add (ref: string, asset: MediaResolverTypes.ClientMediaAsset): boolean {
    if (this.mediaUriTranslator.addPair(asset.ref, asset.uuid)) {
      super.add(ref, asset)
      return true
    }
    return false
  }

  get (uuidOrRef: string): MediaResolverTypes.ClientMediaAsset | undefined {
    const ref = this.mediaUriTranslator.getRef(uuidOrRef)
    if (ref != null) {
      return super.get(ref)
    }
  }
}

// class SampleCache extends Cache<MediaResolverTypes.Sample> {
//   get (uuidOrRef: string): MediaResolverTypes.Sample | undefined {
//     const ref = mediaUriTranslator.getRef(uuidOrRef)
//     if (ref != null) {
//       return super.get(ref)
//     }
//   }
// }

// export class SampleCollection extends Cache<Sample> {
//   private readonly asset: MediaResolverTypes.ClientMediaAsset

//   constructor (asset: MediaResolverTypes.ClientMediaAsset) {
//     super()
//     this.asset = asset
//     this.addFromAsset(asset)
//   }

//   get complete (): Sample | undefined {
//     return this.get(this.asset.ref + '#complete')
//   }

//   private addSample (asset: MediaResolverTypes.ClientMediaAsset, yamlFormat: MediaResolverTypes.SampleYamlFormat): void {
//     const sample = new Sample(asset, yamlFormat)
//     if (this.get(sample.ref) == null) {
//       sampleCache.add(sample.ref, sample)
//       this.add(sample.ref, sample)
//     }
//   }

//   /**
//    * Gather informations to build the default sample “complete”.
//    */
//   private gatherYamlFromRoot (assetFormat: MediaResolverTypes.YamlFormat): MediaResolverTypes.SampleYamlFormat | undefined {
//     const yamlFormat: MediaResolverTypes.SampleYamlFormat = {}
//     if (assetFormat.startTime != null) {
//       yamlFormat.startTime = assetFormat.startTime
//     }
//     if (assetFormat.duration != null) {
//       yamlFormat.duration = assetFormat.duration
//     }
//     if (assetFormat.endTime != null) {
//       yamlFormat.endTime = assetFormat.endTime
//     }
//     if (assetFormat.fadeIn != null) {
//       yamlFormat.startTime = assetFormat.fadeIn
//     }
//     if (assetFormat.fadeOut != null) {
//       yamlFormat.startTime = assetFormat.fadeOut
//     }
//     if (assetFormat.shortcut != null) {
//       yamlFormat.shortcut = assetFormat.shortcut
//     }
//     if (Object.keys(yamlFormat).length > 0) {
//       return yamlFormat
//     }
//   }

//   private addFromAsset (asset: MediaResolverTypes.ClientMediaAsset): void {
//     // search the “complete” sample from the property “samples”.
//     let completeYamlFromSamples: MediaResolverTypes.SampleYamlFormat | undefined
//     if (asset.yaml.samples != null) {
//       for (let i = 0; i < asset.yaml.samples.length; i++) {
//         const sampleYaml = asset.yaml.samples[i]
//         if (sampleYaml.ref != null && sampleYaml.ref === 'complete') {
//           completeYamlFromSamples = sampleYaml
//           asset.yaml.samples.splice(i, 1)
//           break
//         }
//       }
//     }

//     // First add default sample “complete”
//     const completeYamlFromRoot = this.gatherYamlFromRoot(asset.yaml)

//     if (completeYamlFromSamples != null && completeYamlFromRoot != null) {
//       throw new Error('Duplicate definition of the default complete sample')
//     } else if (completeYamlFromSamples != null) {
//       this.addSample(asset, completeYamlFromSamples)
//     } else if (completeYamlFromRoot != null) {
//       this.addSample(asset, completeYamlFromRoot)
//     } else {
//       this.addSample(asset, {})
//     }

//     let counter = 0

//     // Add samples from the YAML property “samples”
//     if (asset.yaml.samples != null) {
//       for (const sampleSpec of asset.yaml.samples) {
//         if (sampleSpec.ref == null && sampleSpec.title == null) {
//           counter++
//           sampleSpec.ref = `sample${counter}`
//           sampleSpec.title = `Ausschnitt ${counter}`
//         }
//         this.addSample(asset, sampleSpec)
//       }
//     }
//   }
// }
