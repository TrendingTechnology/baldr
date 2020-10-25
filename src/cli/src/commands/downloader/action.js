const { operations } = require('@bldr/media-manager')
const { fetchFile } = require('@bldr/core-node')

/**
 * Download a media asset.
 *
 * @param {String} url The source URL.
 * @param {String} id The ID of the destination file.
 * @param {String} extension The extension of the destination file.
 */
async function action (url, id = null, extension = null) {
  if (!extension) {
    extension = url.substring(url.lastIndexOf('.') + 1)
  }

  if (!id) {
    id = url.substring(url.lastIndexOf('/') + 1)
    id = id.replace(/\.\w+$/, '')
  }

  let destFile = `${id}.${extension}`

  await fetchFile(url, destFile)
  // Make images smaller.
  destFile = await operations.convertAsset(destFile)
  await operations.initializeMetaYaml(destFile, { source: url })
}

module.exports = action
