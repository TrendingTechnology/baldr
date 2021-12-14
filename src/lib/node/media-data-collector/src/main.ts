import { AssetBuilder, AssetData } from './asset-builder'

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
