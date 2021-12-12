import path from 'path'
import fs from 'fs'
import { getConfig } from '@bldr/config'
// import { getExtension } from '@bldr/string-format'
import { readYamlFile } from '@bldr/file-reader-writer'
// import { mimeTypeManager } from '@bldr/client-media-models'

const config = getConfig()

interface MediaData {
  relPath: string
  [property: string]: any
}

interface AssetData extends MediaData {
  /**
   * Indicates whether the media asset has a preview image (`_preview.jpg`).
   */
  hasPreview?: boolean

  /**
   * Indicates wheter the media asset has a waveform image (`_waveform.png`).
   */
  hasWaveform?: boolean

  /**
   * The number of parts of a multipart media asset.
   */
  multiPartCount?: number
}

interface PresentationData extends MediaData {}

/**
 * Base class to be extended.
 */
class Builder {
  /**
   * Absolute path ot the media file, not the metadata file.
   */
  protected absPath: string

  protected data: MediaData

  constructor (filePath: string) {
    this.absPath = path.resolve(filePath)
    const relPath = filePath
      .replace(config.mediaServer.basePath, '')
      .replace(/^\//, '')
    this.data = { relPath }
  }

  public importYamlFile (filePath: string, target: any): Builder {
    const data = readYamlFile(filePath)
    for (const property in data) {
      target[property] = data[property]
    }
    return this
  }

  public buildAll (): Builder {
    return this
  }

  public export (): MediaData {
    return this.data
  }
}

/**
 * This class is used both for the entries in the MongoDB database as well for
 * the queries.
 */
class AssetBuilder extends Builder {
  assetData: AssetData

  /**
   * @param filePath - The file path of the media file.
   */
  constructor (filePath: string) {
    super(filePath)
    this.assetData = this.data
  }

  public detectPreview (): AssetBuilder {
    if (fs.existsSync(`${this.absPath}_preview.jpg`)) {
      this.assetData.hasPreview = true
    }
    return this
  }

  public detectWaveform (): AssetBuilder {
    if (fs.existsSync(`${this.absPath}_waveform.png`)) {
      this.assetData.hasWaveform = true
    }
    return this
  }

  /**
   * Search for mutlipart assets. The naming scheme of multipart assets is:
   * `filename.jpg`, `filename_no002.jpg`, `filename_no003.jpg`
   */
  // private detectMultiparts (): AssetBuilder {
  //   const nextAssetFileName = (count: number): string => {
  //     let suffix
  //     if (count < 10) {
  //       suffix = `_no00${count}`
  //     } else if (count < 100) {
  //       suffix = `_no0${count}`
  //     } else if (count < 1000) {
  //       suffix = `_no${count}`
  //     } else {
  //       throw new Error(
  //         `${this.absPath} multipart asset counts greater than 100 are not supported.`
  //       )
  //     }
  //     let basePath = this.absPath
  //     let fileName
  //     if (this.extension != null) {
  //       basePath = this.absPath.replace(`.${this.extension}`, '')
  //       fileName = `${basePath}${suffix}.${this.extension}`
  //     } else {
  //       fileName = `${basePath}${suffix}`
  //     }
  //     return fileName
  //   }

  //   let count = 2
  //   while (fs.existsSync(nextAssetFileName(count))) {
  //     count += 1
  //   }
  //   count -= 1 // The counter is increased before the file system check.
  //   if (count > 1) {
  //     this.multiPartCount = count
  //   }
  //   return this
  // }

  // private detectMimeType (): AssetBuilder {
  //   if (this.extension != null) {
  //     this.mimeType = mimeTypeManager.extensionToType(this.extension)
  //   }
  //   return this
  // }

  public buildAll (): AssetBuilder {
    this.importYamlFile(`${this.absPath}.yml`, this.assetData)
    this.detectPreview()
    this.detectWaveform()
    return this
  }

  public export (): AssetData {
    return this.assetData
  }
}

/**
 * The whole presentation YAML file converted to an Javascript object. All
 * properties are in `camelCase`.
 */
class PresentationBuilder extends Builder {
  // meta?: LampTypes.PresentationMeta

  /**
   * The plain text version of `this.meta.title`.
   */
  // title: string

  /**
   * The plain text version of `this.meta.title (this.meta.subtitle)`
   */
  // titleSubtitle: string

  /**
   * The plain text version of `folderTitles.allTitles
   * (this.meta.subtitle)`
   *
   * For example:
   *
   * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
   * Johann Sebastian Bach: Musik als Bekenntnis /
   * Johann Sebastian Bachs Reise nach Berlin 1747 (Ricercar a 3)
   */
  // allTitlesSubtitle: string

  /**
   * Value is the same as `meta.ref`
   */
  // ref: string

  constructor (filePath: string) {
    super(filePath)
    // const data = readYamlFile(filePath)
    // if (data != null) this.importProperties(data)

    // const deepTitle = titleTreeFactory.addTitleByPath(filePath)

    // if (this.meta == null) {
    //   // eslint-disable-next-line
    //   this.meta = {} as LampTypes.PresentationMeta
    // }

    // if (this.meta?.ref == null) {
    //   this.meta.ref = deepTitle.ref
    // }
    // if (this.meta?.title == null) {
    //   this.meta.title = deepTitle.title
    // }
    // if (this.meta?.subtitle == null) {
    //   this.meta.subtitle = deepTitle.subtitle
    // }
    // if (this.meta?.curriculum == null) {
    //   this.meta.curriculum = deepTitle.curriculum
    // }
    // if (this.meta?.grade == null) {
    //   this.meta.grade = deepTitle.grade
    // }
    // this.title = stripTags(this.meta.title)
    // this.titleSubtitle = this.titleSubtitle_()
    // this.allTitlesSubtitle = this.allTitlesSubtitle_(deepTitle)
    // this.ref = this.meta.ref
  }

  // /**
  //  * Generate the plain text version of `this.meta.title (this.meta.subtitle)`
  //  */
  // private titleSubtitle_ (): string {
  //   if (this.meta?.subtitle != null) {
  //     return `${this.title} (${stripTags(this.meta.subtitle)})`
  //   } else {
  //     return this.title
  //   }
  // }

  // /**
  //  * Generate the plain text version of `folderTitles.allTitles
  //  * (this.meta.subtitle)`
  //  *
  //  * For example:
  //  *
  //  * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
  //  * Johann Sebastian Bach: Musik als Bekenntnis /
  //  * Johann Sebastian Bachs Reise nach Berlin 1747 (Ricercar a 3)
  //  */
  // private allTitlesSubtitle_ (folderTitles: DeepTitle): string {
  //   let all = folderTitles.allTitles
  //   if (this.meta?.subtitle != null) {
  //     all = `${all} (${this.meta.subtitle})`
  //   }
  //   return stripTags(all)
  // }
}

/* Insert *********************************************************************/

// type ServerMediaType = 'presentations' | 'assets'

// async function insertObjectIntoDb (
//   filePath: string,
//   mediaType: ServerMediaType
// ): Promise<void> {
//   let object:
//     | ServerPresentation
//     | ServerMediaAsset
//     | ServerMediaFile
//     | undefined
//   try {
//     if (mediaType === 'presentations') {
//       object = new ServerPresentation(filePath)
//     } else if (mediaType === 'assets') {
//       // Now only with meta data yml. Fix problems with PDF lying around.
//       if (!fs.existsSync(`${filePath}.yml`)) return
//       object = new ServerMediaAsset(filePath)
//     }
//     if (object == null) return
//     object = object.build()
//     await database.db.collection(mediaType).insertOne(object)
//   } catch (e) {
//     const error = e as GenericError
//     console.log(error)
//     let relPath = filePath.replace(config.mediaServer.basePath, '')
//     relPath = relPath.replace(new RegExp('^/'), '')
//     // eslint-disable-next-line
//     const msg = `${relPath}: [${error.name}] ${error.message}`
//     console.log(msg)
//     errors.push(msg)
//   }
// }

export function readAssetFile (filePath: string): AssetData {
  const builder = new AssetBuilder(filePath)
  builder.buildAll()
  return builder.export()
}
// export function readPresentationFile (filePath: string): PresentationData {}
