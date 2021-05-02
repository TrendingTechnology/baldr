const path = require('path')

const { ClientMediaAsset } = require('../dist/node/asset.js')
const { deepCopy, genUuid, getExtension } = require('@bldr/core-browser')

const assetYamlSkeleton = {
  ref: 'test',
  mimeType: 'image',
  title: 'Test',
  path: 'dir/test.jpg',
  previewImage: undefined,
  size: 1,
  timeModified: new Date().getTime()
}

function createAsset (spec = {}) {
  const yaml = deepCopy(assetYamlSkeleton)
  for (const prop in spec) {
    yaml[prop] = spec[prop]
  }

  if (yaml.filename == null) yaml.filename = path.basename(yaml.path)
  if (yaml.extension == null) yaml.extension = getExtension(yaml.path)
  if (yaml.uuid == null) yaml.uuid = genUuid()

  return new ClientMediaAsset(`ref:${yaml.ref}`, `http://localhost/${yaml.path}`, yaml)
}

module.exports = {
  createAsset
}
