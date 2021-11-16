const path = require('path')

const { ClientMediaAsset } = require('../dist/node/asset.js')
const { deepCopy, genUuid, getExtension } = require('@bldr/core-browser')
const { makeHttpRequestInstance } = require('@bldr/http-request')
const { resolve } = require('../dist/node/resolve.js')
const { getConfig } = require('@bldr/config')
const config = getConfig()

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

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media')

async function update () {
  await httpRequest.request('mgmt/update')
}

async function resolveByUuid (uuid) {
  return resolve('uuid:' + uuid)
}

async function resolveSingleByUuid (uuid) {
  const assets = await resolveByUuid(uuid)
  return assets[0]
}

module.exports = {
  createAsset,
  resolveSingleByUuid,
  resolveByUuid,
  update
}
