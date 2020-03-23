// Node packages.
const path = require('path')

// Project packages.
const { bootstrapConfig } = require('@bldr/core-node')
const { RawDataObject } = require('@bldr/core-browser')

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
          value = asciify(value)

          // a-Strawinsky-Petruschka-Abschnitt-0_22
          value = value.replace(/^[va]-/, '')

          // HB_Ausstellung_Gnome -> Ausstellung_HB_Gnome
          value = value.replace(/^([A-Z]{2,})_([a-zA-Z0-9-]+)_/, '$2_$1_')
          return value
        },
        required: true
      },
      title: {
        required: true
      },
      type: {
        validate: function (value) {
          return String(value).match(/^[a-zA-Z]+$/)
        }
      },
      wikidata: {
        validate: function (value) {
          return String(value).match(/^Q\d+$/)
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
  audioSample: {
    detectType: {
      byPath: new RegExp('^.*/HB/.*$')
    },
    props: {
      title: {
        format: function (value) {
          // 'Tonart CD 4: Spur 29'
          if (!value.match(/.+CD.+Spur/)) {
            return value
          }
        }
      },
      composer: {
        format: function (value) {
          // Helbling-Verlag
          if (value.indexOf('Verlag') === -1) {
            return value
          }
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
  const result = {}
  for (const prop in globalType) {
    if (specifcType[prop]) {
      result[prop] = Object.assign({}, globalType[prop], specifcType[prop])
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

/**
 * If `metadata` has a property `type` apply the global specs, else the
 * specifiy specs.
 *
 * @param {Object} metadata
 * @param {Function} func - A function with the arguments `spec` (property specification), `value`, `propName`
 * @param {Boolean} replaceValues - Replace the values in the metadata object.
 */
function applyTypeSpecs (metadata, func, replaceValues = true) {
  function applyOneTypeSpec (props, propName, metadata, func, replaceValues) {
    const spec = props[propName]
    const value = func(spec, metadata[propName], propName)
    if (replaceValues && isValue(value)) {
      metadata[propName] = value
    }
  }

  if (metadata.type) {
    const props = typeProps[metadata.type]
    for (const propName in props) {
      applyOneTypeSpec(props, propName, metadata, func, replaceValues)
    }
  } else {
    const props = typeSpecs.global_.props
    for (const propName in props) {
      applyOneTypeSpec(props, propName, metadata, func, replaceValues)
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
  function validateOneProp (spec, value, prop) {
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

  function addValue (data, propName, value) {
    if (isValue(value)) data[propName] = value
  }

  const result = {}
  if (metadata.type) {
    const props = typeProps[metadata.type]
    for (const propName in props) {
      const spec = props[propName]
      if (isPropertyDerived(spec)) {
        addValue(result, propName, spec.derived.call(metadata))
        // Throw away the value of this property. We prefer the derived
        // version.
        rawData.cut(propName)
      } else {
        addValue(result, propName, rawData.cut(propName))
      }
    }
  }

  // Add additional properties not in the specs.
  for (const propName in rawData.raw) {
    addValue(result, propName, rawData.cut(propName))
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
  metadata = format(metadata)
  validate(metadata)
  return metadata
}

module.exports = {
  detectTypeByPath,
  process
}
