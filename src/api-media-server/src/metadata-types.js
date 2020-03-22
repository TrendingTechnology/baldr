// Node packages.
const path = require('path')

// Project packages.
const { bootstrapConfig } = require('@bldr/core-node')
const { RawDataObject  } = require('@bldr/core-browser')

/**
 * The configuration object from `/etc/baldr.json`
 */
const config = bootstrapConfig()

const metadataTypes = {
  person: {
    basePath: path.join(config.mediaServer.basePath, 'Personen'),
    detectType: {
      byPath: new RegExp('^' + path.join(config.mediaServer.basePath, 'Personen') + '/.*')
    },
    props: {
      id: {
        derived: function () {
          return `${this.lastname}_${this.firstname}`
        }
      },
      title: {
        derived: function () {
          return `Portrait-Bild von „${this.firstname} ${this.lastname}“`
        }
      },
      firstname: {
        required: true
      },
      lastname: {
        required: true
      },
      name: {
        derived: function () {
          return `${this.firstname} ${this.lastname}`
        }
      },
      short_biography: {
        required: true
      },
      birth: {
        validate: function (value) {
          return value.match(/\d{4,}-\d{2,}-\d{2,}/)
        }
      },
      death: {
        validate: function (value) {
          return value.match(/\d{4,}-\d{2,}-\d{2,}/)
        }
      }
    }
  }
}

/**
 * @param {Object} spec - The specification of one property
 * @param {String} prop
 *
 * @private
 */
function isPropertyDerived (spec) {
  if (spec && spec.derived && typeof spec.derived === 'function'
  ) return true
  return false
}

function detectTypeByPath (filePath) {
  filePath = path.resolve(filePath)
  for (const typeName in metadataTypes) {
    const regex = metadataTypes[typeName].detectType.byPath
    if (filePath.match(regex)) return typeName
  }
}

function validate () {

}

/**
 *
 * @param {Object} rawMetaData
 * @param {String} metaDataType
 *
 * @returns {Object}
 */
function process (rawMetaData, metaDataType) {
  const result = {}
  const rawData = new RawDataObject(rawMetaData)
  const props = metadataTypes[metaDataType].props
  for (const prop in props) {
    const spec = props[prop]
    if (isPropertyDerived(spec)) {
      result[prop] = spec.derived.call(rawMetaData)
      // Throw away the value of this property. We prefer the derived
      // version.
      rawData.cut(prop)
    } else {
      result[prop] = rawData.cut(prop)
    }
  }

  // Add additional properties not in the specs.
  for (const prop in rawData.raw) {
    result[prop] = rawData.cut(prop)
  }
  return result
}

module.exports = {
  detectTypeByPath,
  process
}
