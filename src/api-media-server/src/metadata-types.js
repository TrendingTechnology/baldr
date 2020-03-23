// Node packages.
const path = require('path')

// Project packages.
const { bootstrapConfig } = require('@bldr/core-node')
const { RawDataObject  } = require('@bldr/core-browser')

const { asciify } = require('./helper.js')

/**
 * The configuration object from `/etc/baldr.json`
 */
const config = bootstrapConfig()

const typeSpecs = {
  global_: {
    props: {
      id: {
        validate: function (value) {
          return value.match(/^[a-zA-Z0-9-_]+$/)
        },
        format: function (value) {
          return asciify(value)
        },
        required: true
      },
      title: {
        required: true
      },
      type: {
        validate: function (value) {
          return value.match(/^[a-z]+$/)
        }
      },
      wikidata: {
        validate: function (value) {
          return value.match(/^Q\d+$/)
        }
      },
      wikipedia: {
        validate: function (value) {
          return value.match(/^.+:.+$/)
        },
        format: function (value) {
          return decodeURI(value)
        }
      }
    }
  },
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
 * Merge the global metadata type specification with a specific type.
 *
 * @param {String} typeName - The name of the metadata type (for example `person`)
 */
function mergeTypeProps (typeName) {
  const globalType = typeSpecs.global_.props
  const specifcType = typeSpecs[typeName].props
  result = {}
  for (const prop in globalType) {
    if (specifcType[prop]) {
      result[prop] = Object.assign(globalType[prop], specifcType[prop])
      delete specifcType[prop]
    } else {
      result[prop] = globalType[prop]
    }
  }

  for (const prop in specifcType) {
    result[prop] = specifcType[prop]
  }

  return result
}

function buildTypeProps () {
  const result = {}
  for (const typeName in typeSpecs) {
    // Exclude “global_”
    if (!typeName.match(/^.+_$/)) {
      result[typeName] = mergeTypeProps(typeName)
    }
  }
  return result
}

/**
 * ```
 * {
 *   person: {
 *     id: { validate: [Function: validate], derived: [Function: derived] },
 *     title: { validate: [Function: validate], derived: [Function: derived] },
 *     metadataType: { validate: [Function: validate] },
 *     wikidata: { validate: [Function: validate] },
 *     wikipedia: { validate: [Function: validate] },
 *     firstname: { required: true },
 *     lastname: { required: true },
 *     name: { derived: [Function: derived] },
 *     short_biography: { required: true },
 *     birth: { validate: [Function: validate] },
 *     death: { validate: [Function: validate] }
 *   }
 * }
 * ```
 */
const typeProps = buildTypeProps()

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
  for (const typeName in typeSpecs) {
    const typeSpec = typeSpecs[typeName]
    if (typeSpec.detectType && typeSpec.detectType.byPath && typeSpec.detectType.byPath instanceof RegExp) {
      if (filePath.match(typeSpec.detectType.byPath)) return typeName
    }
  }
}

function isValue (value) {
  if (value || typeof value === 'boolean') {
    return true
  }
  return false
}

function applyTypeSpecs (metadata, func, replaceValues = true) {
  if (metadata.type) {
    const props = typeProps[metadata.type]
    for (const prop in props) {
      const spec = props[prop]
      if (replaceValues) {
        metadata[prop] = func(spec, metadata[prop])
      } else {
        func(spec, metadata[prop])
      }
    }
  } else {
    const props = typeSpecs.global_.props
    for (const prop in props) {
      const spec = props[prop]
      if (replaceValues) {
        metadata[prop] = func(spec, metadata[prop])
      } else {
        func(spec, metadata[prop])
      }
    }
  }
  return metadata
}

/**
 * @param {Object} metadata
 */
function format (metadata) {
  function formatOneProp (spec, value) {
    if (
      isValue(value) &&
      spec.format &&
      typeof spec.format === 'function'
    ) {
      return spec.format(value)
    }
    return value
  }

  return applyTypeSpecs(metadata, formatOneProp)
}

/**
 * @param {Object} metadata
 */
function validate (metadata) {
  function validateOneProp(spec, value) {
    // required
    if (spec.required && !isValue(value)) {
      throw new Error(`Missing property ${prop}`)
    }
    // validate
    if (spec.validate && typeof spec.validate === 'function' && isValue(value)) {
      const result = spec.validate(value)
      if (!result) {
        throw new Error(`Validation failed for property “${prop}” and value “${value}”`)
      }
    }
  }

  applyTypeSpecs(metadata, validateOneProp, false)
}

/**
 * @param {Object} metadata
 */
function sortAndDerive (metadata) {
  const rawData = new RawDataObject(metadata)

  if (metadata.type) {
    const props = typeProps[metadata.type]
    for (const prop in props) {
      const spec = props[prop]
      if (isPropertyDerived(spec)) {
        result[prop] = spec.derived.call(metadata)
        // Throw away the value of this property. We prefer the derived
        // version.
        rawData.cut(prop)
      } else {
        result[prop] = rawData.cut(prop)
      }
    }
  }

  // Add additional properties not in the specs.
  for (const prop in rawData.raw) {
    result[prop] = rawData.cut(prop)
  }
  return result
}

/**
 *
 * @param {Object} metadata
 *
 * @returns {Object}
 */
function process (metadata) {
  metadata = sortAndDerive(metadata)
  format(metadata)
  validate(metadata)
  return metadata
}

module.exports = {
  detectTypeByPath,
  process
}
