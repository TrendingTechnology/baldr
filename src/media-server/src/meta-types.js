/**
 * @module @bldr/media-server/meta-types
 */

// Node packages.
const path = require('path')

// Project packages.
const { deepCopy, getExtension, convertPropertiesCase } = require('@bldr/core-browser')

/**
 * @type {module:@bldr/media-server/meta-types~typeSpecs}
 */
const rawTypeSpecs = require('./meta-type-specs.js')

const typeSpecs = mergeTypeSpecs(rawTypeSpecs)

/**
 * The name of a property.
 *
 * @typedef {String} propName
 */

/**
 * The specification of a property.
 *
 * @typedef {Object} propSpec
 * @property {Boolean} required - True if the property is required.
 * @property {Function} derive - A function to derive this property from
 *   other values. The function is called with `function (typeData, typeSpec)`.
 *   Or `this.otherProp` in the function to access different
 *   values.
 * @property {Boolean} overwriteByDerived - Overwrite the original value by the
 *   the value obtained from the `derive` function.
 * @property {Function} format - Format the property using this function.
 * @property {Function} validate - Validate the property using this function.
 */

/**
 * The specification of all properties. The single `propSpec`s are indexed
 * by the `propName`.
 *
 * ```js
 * const propSpecs = {
 *   propName1: propSpec1,
 *   propName2: propSpec2
 *   ...
 * }
 * ```
 *
 * @typedef {Object} propSpecs
 */

/**
 * The specification of one metadata type.
 *
 * @typedef {Object} typeSpec
 * @property {String} abbreviation - A two letter abbreviation. Used in
 *   the IDs.
 * @property {String} basePath - The base path where all meta typs stored in.
 * @property {Function} relPath - A function which must return the
 *   relative path (relative to `basePath`). The function is called with
 *   `function (typeData, typeSpec)`.
 * @property {Object} detectType - An object with at the moment one property:
 * @property {RegExp} detectType.byPath - An regular expression that is
 *   matched against file paths.
 * @property {module:@bldr/media-server/meta-types~propSpecs} props
 */

/**
 * The specification of all meta types
 *
 * ```js
 * const typeSpecs = {
  *   typeName1: typeSpec1,
  *   typeName2: typeSpec2
  *   ...
  * }
  * ```
 *
 * @typedef {Object} typeSpecs
 */

/**
 * The name of a meta type, for example `person`, `group`.
 *
 * @typedef {String} typeName
 */

/**
 * Some actual data which can be assigned to a meta type.
 *
 * @typedef {Object} typeData
 */

/**
 * @param {String} value
 *
 * @returns {Boolean}
 */
function validateDate (value) {
  return value.match(/\d{4,}-\d{2,}-\d{2,}/)
}

/**
 *
 * @param {String} value
 *
 * @returns {Boolean}
 */
function validateUuid (value) {
  return value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i)
}

/**
 * @returns {Object}
 */
function mergeTypeSpecs (typeSpecs) {
  /**
   * Merge the global metadata type specification with a specific type.
   *
   * @param {String} typeName - The name of the metadata type (for example `person`)
   */
  function mergeTypeProps (typeName, typeSpecs) {
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

  for (const typeName in typeSpecs) {
    // Exclude “global_”
    if (!typeName.match(/^.+_$/)) {
      typeSpecs[typeName].props = mergeTypeProps(typeName, typeSpecs)
    }
  }
  delete typeSpecs.global_
  return typeSpecs
}

/**
 * @param {String} filePath
 *
 * @returns {String} - The type name for example `person`, `group`
 */
function detectTypeByPath (filePath) {
  filePath = path.resolve(filePath)
  for (const typeName in typeSpecs) {
    const typeSpec = typeSpecs[typeName]
    if (typeSpec.detectType && typeSpec.detectType.byPath && typeSpec.detectType.byPath instanceof RegExp) {
      if (filePath.match(typeSpec.detectType.byPath)) return typeName
    }
  }
}

/**
 * @param {Object} data - The mandatory property is “metaTye” and “extension”.
 *   One can omit the property “extension”, but than you have to specify the
 *   property “mainImage”.
 *
 * @returns {String} - A absolute path
 */
function formatFilePath (data) {
  if (!data.metaType) throw new Error(`Your data needs a property named “metaType”.`)
  const typeSpec = typeSpecs[data.metaType]
  if (!typeSpec) throw new Error(`Unkown meta type “${data.metaType}”.`)
  // The relPath function needs this.extension.
  if (!data.extension) {
    if (!data.mainImage) throw new Error(`Your data needs a property named “mainImage”.`)
    data.extension = getExtension(data.mainImage)
    // b/Bush_George-Walker/main.jpeg
  }
  if (data.extension === 'jpeg') data.extension = 'jpg'
  // b/Bush_George-Walker/main.jpeg
  const relPath = typeSpec.relPath.call(data, data, typeSpecs[data.metaType])
  // To avoid confusion with class MediaFile in the module @bldr/vue-plugin-media
  delete data.extension
  return path.join(typeSpec.basePath, relPath)
}

/**
 * @param {Mixed} value
 *
 * @returns {Boolean}
 */
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

  if (metadata.metaType) {
    const props = typeSpecs[metadata.metaType].props
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
 * @param {module:@bldr/media-server/meta-types~propSpec} propSpec - The
 *   specification of one property
 */
function isPropertyDerived (propSpec) {
  if (propSpec && propSpec.derive && typeof propSpec.derive === 'function') {
    return true
  }
  return false
}

/**
 * Sort the given object according the type specification. Not specifed
 * propertiers are attached on the end of the object. Fill the object
 * with derived values.
 *
 * @param {Object} data
 *
 * @returns {Object}
 */
function sortAndDerive (data) {
  const origData = deepCopy(data)
  const result = {}

  const metaType = origData.metaType

  // Loop over the propSpecs to get a sorted object
  if (metaType) {
    const propSpecs = typeSpecs[metaType].props
    for (const propName in propSpecs) {
      const propSpec = propSpecs[propName]
      const origValue = origData[propName]
      let derivedValue
      if (isPropertyDerived(propSpec)) {
        derivedValue = propSpec.derive.call(data, data, typeSpecs[metaType])
      }

      // Use the derived value
      if (
        isValue(derivedValue) &&
        (
          (!propSpec.overwriteByDerived && !isValue(origValue)) ||
          propSpec.overwriteByDerived
        )
      ) {
        result[propName] = derivedValue

      // Use orig value
      } else if (isValue(origValue)) {
        result[propName] = origValue
      }
      // Throw away the value of this property. We prefer the derived
      // version.
      delete origData[propName]
    }
  }

  // Add additional properties not in the propSpecs.
  for (const propName in origData) {
    const value = origData[propName]
    if (isValue(value)) {
      result[propName] = value
    }
  }
  return result
}

/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param {Object} data - An object containing some meta data.
 *
 * @returns {Object}
 */
function process (data) {
  console.log(data)
  // The meta type specification is in camel case. The meta data is
  // stored in the YAML format in snake case
  data = convertPropertiesCase(data, 'snake-to-camel')
  data = sortAndDerive(data)
  data = format(data)
  validate(data)
  // Do not convert back. This conversion should be the last step, before
  // object is converted to YAML.
  // convertPropertiesCase(data, 'camel-to-snake')
  return data
}

module.exports = {
  detectTypeByPath,
  formatFilePath,
  process,
  typeSpecs,
  validateDate,
  validateUuid
}
