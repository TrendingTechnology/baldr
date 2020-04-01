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
const typeSpecs = require('./meta-type-specs.js')

/**
 * The name of a property.
 *
 * @typedef {String} propName
 */

/**
 * The specification of a property.
 *
 * @typedef {Object} propSpec
 *
 * @property {Boolean} required - True if the property is required.
 *
 * @property {Function} derive - A function to derive this property from
 *   other values. The function is called with `function (typeData, typeSpec)`.
 *   Or `this.otherProp` in the function to access different
 *   values.
 *
 * @property {Boolean} overwriteByDerived - Overwrite the original value by the
 *   the value obtained from the `derive` function.
 *
 * @property {Function} format - Format the value of the property using this
 *   function. The function has this arguments:
 *   `function (value, { typeData, typeSpec })`
 *
 * @property {RegExp} removeByRegexp - If the value matches the specified
 *   regular expression, remove the property.
 *
 * @property {Function} validate - Validate the property using this function.
 *
 * @property {module:@bldr/wikidata~propSpec} wikidata - See package
 *   `@bldr/wikidata`.
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
 *
 * @property {String} abbreviation - A two letter abbreviation. Used in
 *   the IDs.
 *
 * @property {String} basePath - The base path where all meta typs stored in.
 *
 * @property {Function} relPath - A function which must return the
 *   relative path (relative to `basePath`). The function is called with
 *   `function (typeData, typeSpec)`.
 *
 * @property {RegExp} detectTypebyPath - A regular expression that is
 *   matched against file paths or a function which is called with `typeSpec`
 *   that returns a regexp.
 *
 * @property {Function} finalize - A function which is called after all
 *   processing steps: arguments: `typeData`, `typeSpec`
 *
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
 * Check a file path against regepx to get a type name.
 *
 * @param {String} filePath
 *
 * @returns {module:@bldr/media-server/meta-types~typeName} - The type name
 *   for example `person`, `group`
 */
function detectTypeByPath (filePath) {
  filePath = path.resolve(filePath)
  for (const typeName in typeSpecs) {
    const typeSpec = typeSpecs[typeName]
    if (typeSpec.detectTypeByPath) {
      let regexp
      if (typeof typeSpec.detectTypeByPath === 'function') {
        regexp = typeSpec.detectTypeByPath(typeSpec)
      } else {
        regexp = typeSpec.detectTypeByPath
      }
      if (filePath.match(regexp)) return typeName
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
 * Apply the meta type specifications to all props
 *
 * @param {Object} data - An object containing some meta data.
 * @param {Function} func - A function with the arguments `spec`
 *   (property specification), `value`, `propName`
 * @param {module:@bldr/media-server/meta-types~typeSpec} - The specification
 *   of one meta type.
 * @param {Boolean} replaceValues - Replace the values in the metadata object.
 */
function applySpecToProps (data, func, typeSpec, replaceValues = true) {
  function applyOneTypeSpec (props, propName, data, func, replaceValues) {
    const propSpec = props[propName]
    const value = func(propSpec, data[propName], propName)
    if (replaceValues && isValue(value)) {
      data[propName] = value
    }
  }
  const propSpecs = typeSpec.props
  for (const propName in propSpecs) {
    applyOneTypeSpec(propSpecs, propName, data, func, replaceValues)
  }
  return data
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
 * @param {Object} data - An object containing some meta data.
 * @param {module:@bldr/media-server/meta-types~typeSpec} - The specification
 *   of one meta type.
 *
 * @returns {Object}
 */
function sortAndDeriveProps (data, typeSpec) {
  const origData = deepCopy(data)
  const result = {}

  // Loop over the propSpecs to get a sorted object
  const propSpecs = typeSpec.props
  for (const propName in propSpecs) {
    const propSpec = propSpecs[propName]
    const origValue = origData[propName]
    let derivedValue
    if (isPropertyDerived(propSpec)) {
      derivedValue = propSpec.derive.call(data, data, typeSpec)
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
 * @param {Object} data - An object containing some meta data.
 * @param {module:@bldr/media-server/meta-types~typeName} - The type name
 */
function formatProps (data, typeSpec) {
  function formatOneProp (spec, value) {
    if (
      isValue(value) &&
      spec.format &&
      typeof spec.format === 'function'
    ) {
      return spec.format(value, { typeData: data, typeSpec })
    }
    return value
  }
  return applySpecToProps(data, formatOneProp, typeSpec)
}

/**
 * @param {Object} data - An object containing some meta data.
 * @param {module:@bldr/media-server/meta-types~typeSpec} - The specification
 *   of one meta type.
 */
function validateProps (data, typeSpec) {
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
  applySpecToProps(data, validateOneProp, typeSpec, false)
}

/**
 * Delete properties from the data.
 *
 * @param {Object} data - An object containing some meta data.
 * @param {module:@bldr/media-server/meta-types~typeSpec} - The specification
 *   of one meta type.
 */
function removeProps (data, typeSpec) {
  for (const propName in typeSpec.props) {
    if (data[propName]) {
      const value = data[propName]
      const propSpec = typeSpec.props[propName]
      if (
        (propSpec.state && propSpec.state === 'absent') ||
        (propSpec.removeByRegexp && propSpec.removeByRegexp instanceof RegExp && value.match(propSpec.removeByRegexp))
      ) {
        delete data[propName]
      }
    }
  }
  return data
}

/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param {Object} data - An object containing some meta data.
 * @param {module:@bldr/media-server/meta-types~typeName} - The type name

 * @returns {Object}
 */
function processByType (data, typeName) {
  if (!typeSpecs[typeName]) {
    throw new Error(`Unkown meta type name: “${typeName}”`)
  }
  const typeSpec = typeSpecs[typeName]
  if (!typeSpec.props) {
    throw new Error(`The meta type “${typeName}” has no props.`)
  }
  data = sortAndDeriveProps(data, typeSpec)
  data = formatProps(data, typeSpec)
  // We need filePath in format. Must be after formatProps
  data = removeProps(data, typeSpec)

  validateProps(data, typeSpec)

  if (typeSpec.finalize && typeof typeSpec.finalize === 'function') {
    data = typeSpec.finalize(data, typeSpec)
  }
  return data
}

/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param {Object} data - An object containing some meta data.
 *
 * @returns {Object}
 */
function process (data) {
  // The meta type specification is in camel case. The meta data is
  // stored in the YAML format in snake case
  data = convertPropertiesCase(data, 'snake-to-camel')
  if (data.metaType) {
    data = processByType(data, data.metaType)
  }
  data = processByType(data, 'general')
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
