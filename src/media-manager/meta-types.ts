/**
 * Code to manage and process the meta data types of the media server.
 *
 * A media asset can be attached to multiple meta data types (for example:
 * `meta_types: recording,composition`). All meta data types belong to the type
 * `general`. The meta type `general` is applied at the end.
 *
 * The meta data types are specified in the module
 * {@link module:@bldr/media-server/meta-type-specs meta-type-specs}
 *
 * @module @bldr/media-manager/meta-types
 */

// Node packages.
import path from 'path'

// Project packages.
import { deepCopy, getExtension, convertPropertiesSnakeToCamel }  from '@bldr/core-browser-ts'
import  config from '@bldr/config'
import { MediaAssetFileFormat } from '@bldr/type-defintions'

import { DeepTitle } from './titles'

/**
 * The name of a property.
 */
type PropName = string


type State = 'absent' | 'present'

/**
 * The specification of a property.
 */
interface PropSpec {
  /**
   * A title of the property.
   */
  title: string

  /**
   * A text which describes the property.
   */
  description: string

  /**
   * True if the property is required.
   */
  required: boolean

  /**
   * A function to derive this property from other values. The function
   * is called with `derive ({ typeData, typeSpec, folderTitles,
   * filePath })`.
   */
  derive: Function

  /**
   * Overwrite the original value by the
   * the value obtained from the `derive` function.
   */
  overwriteByDerived: boolean

  /**
   * Format the value of the property using this function. The function
   * has this arguments: `format (value, { typeData, typeSpec })`
   */
  format: Function

  /**
   * If the value matches the specified regular expression, remove the
   * property.
   *
   */
  removeByRegexp: RegExp

  /**
   * Validate the property using this function.
   */
  validate: Function

  /**
   * @type {module:@bldr/wikidata~propSpec} See package
   *   `@bldr/wikidata`.
   */
  wikidata: object

  /**
   * `absent` or `present`
   */
  state?: State
}

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
 */
interface PropSpecCollection {
  [key: string]: PropSpec
}

/**
 * The name of a meta type, for example `person`, `group`.
 */
type TypeName =
  'cloze' |
  'composition' |
  'cover' |
  'group' |
  'instrument' |
  'person' |
  'photo' |
  'radio' |
  'recording' |
  'reference' |
  'score' |
  'song' |
  'worksheet' |
  'youtube' |
  'general'

 /**
  * The specification of one metadata type.
  */
interface TypeSpec {
  /**
   * A title for the metadata type.
   */
  title: string

  /**
   * A text to describe a metadata type.
   */
  description: string

  /**
   * A two letter abbreviation. Used in the IDs.
   */
  abbreviation: string

  /**
   * The base path where all meta typs stored in.
   */
  basePath: string

  /**
   * A function which must return the relative path (relative to
   * `basePath`). The function is called with `relPath ({ typeData,
   * typeSpec, oldRelPath })`.
   */
  relPath: Function

  /**
   * A regular expression that is matched against file paths or a
   * function which is called with `typeSpec` that returns a regexp.
   */
  detectTypeByPath: RegExp | Function

  /**
   * A function which is called before all processing steps: `initialize
   * ({ typeData, typeSpec })`.
   */
  initialize: Function

  /**
   * A function which is called after all processing steps: arguments:
   * `finalize ({ typeData, typeSpec })`
   */
  finalize: Function

  /**
   *
   */
  props: PropSpecCollection
}

/**
 * The specification of all meta types
 *
 * ```js
 * const TypeSpecCollection = {
 *   typeName1: typeSpec1,
 *   typeName2: typeSpec2
 *   ...
 * }
 * ```
 */
type TypeSpecCollection = {[key in TypeName]: TypeSpec}

/**
 * Multiple meta data type names, separated by commas, for example
 * `work,recording`. `work,recording` is equivalent to `general,work,recording`.
 */
type TypeNames = string

/**
 * Some actual data which can be assigned to a meta type.
 */
type TypeData = object

function generateTmpTypeSpecCollection(): TypeSpecCollection {
  return <TypeSpecCollection> {}
}

/**
 * @type {module:@bldr/media-server/meta-types~typeSpecs}
 */
//const typeSpecs = require('./meta-type-specs.js')
const typeSpecs: TypeSpecCollection = generateTmpTypeSpecCollection()

/**
 * Check a file path against a regular expression to get the type name.
 *
 * @param filePath
 *
 * @returns The type names for example `person,group,general`
 */
function detectTypeByPath (filePath: string): TypeNames | undefined {
  filePath = path.resolve(filePath)
  const typeNames = new Set()
  for (const typeName in typeSpecs) {
    const typeSpec = typeSpecs[typeName]
    if (typeSpec.detectTypeByPath) {
      let regexp
      if (typeof typeSpec.detectTypeByPath === 'function') {
        regexp = typeSpec.detectTypeByPath(typeSpec)
      } else {
        regexp = typeSpec.detectTypeByPath
      }
      if (filePath.match(regexp)) typeNames.add(typeName)
    }
  }
  typeNames.add('general')
  if (typeNames.size) return [...typeNames].join(',')
}

/**
 * Generate the file path of the first specifed meta type.
 *
 * @param data - The mandatory property is “metaTypes” and “extension”.
 *   One can omit the property “extension”, but than you have to specify
 *   the property “mainImage”.
 * @param oldPath - The old file path.
 *
 * @returns A absolute path
 */
function formatFilePath (data: MediaAssetFileFormat, oldPath: string): string {
  if (!data.metaTypes) throw new Error(`Your data needs a property named “metaTypes”.`)
  // TODO: support multiple types
  // person,general -> person
  const typeName: TypeName = data.metaTypes.replace(/,.*$/, '')
  const typeSpec = typeSpecs[typeName]
  if (!typeSpec) throw new Error(`Unkown meta type “${typeName}”.`)

  if (!typeSpec.relPath || typeof typeSpec.relPath !== 'function') {
    return ''
  }

  // The relPath function needs this.extension.
  if (!data.extension) {
    if (!data.mainImage) throw new Error(`Your data needs a property named “mainImage”.`)
    data.extension = getExtension(data.mainImage)
    // b/Bush_George-Walker/main.jpeg
  }
  if (data.extension === 'jpeg') data.extension = 'jpg'
  let oldRelPath
  if (oldPath) {
    oldRelPath = path.resolve(oldPath)
    oldRelPath = oldRelPath.replace(config.mediaServer.basePath, '')
    oldRelPath = oldRelPath.replace(/^\//, '')
  }

  // b/Bush_George-Walker/main.jpeg
  const relPath = typeSpec.relPath({ typeData: data, typeSpec, oldRelPath })
  if (!relPath) throw new Error(`The relPath() function has to return a string for meta type “${typeName}”`)
  // To avoid confusion with class MediaFile in the module @bldr/media-client
  delete data.extension
  const basePath = typeSpec.basePath ? typeSpec.basePath : config.mediaServer.basePath
  return path.join(basePath, relPath)
}

/**
 * @param value
 */
function isValue (value: string | boolean | number): boolean {
  if (value || typeof value === 'boolean') {
    return true
  }
  return false
}

/**
 * Apply the meta type specifications to all props.
 *
 * @param data - An object containing some meta data.
 * @param func - A function with the arguments `spec` (property
 *   specification), `value`, `propName`
 * @param typeSpec - The specification of one meta type.
 * @param replaceValues - Replace the values in the metadata object.
 */
function applySpecToProps (data: MediaAssetFileFormat, func: Function, typeSpec: TypeSpec, replaceValues: boolean = true) {
  function applyOneTypeSpec (props, propName, data: MediaAssetFileFormat, func: Function, replaceValues: boolean) {
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
 * @param propSpec - The
 *   specification of one property
 */
function isPropertyDerived (propSpec: PropSpec) {
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
 * @param data - An object containing some meta data.
 * @param typeSpec - The specification of one meta type.
 */
function sortAndDeriveProps (data: MediaAssetFileFormat, typeSpec: TypeSpec): MediaAssetFileFormat {
  const origData = deepCopy(data)
  const result = <MediaAssetFileFormat>{}

  let folderTitles
  let filePath
  if (data.filePath) {
    filePath = data.filePath
    folderTitles = new DeepTitle(data.filePath)
  }

  // Loop over the propSpecs to get a sorted object
  const propSpecs = typeSpec.props
  for (const propName in propSpecs) {
    const propSpec = propSpecs[propName]
    const origValue = origData[propName]
    let derivedValue
    if (isPropertyDerived(propSpec)) {
      derivedValue = propSpec.derive({ typeData: data, typeSpec, folderTitles, filePath })
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
 * @param data - An object containing some meta data.
 * @param typeSpec - The type name
 */
function formatProps (data: MediaAssetFileFormat, typeSpec: TypeSpec) {
  function formatOneProp (spec: PropSpec, value: any) {
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
 * @param data - An object containing some meta data.
 * @param typeSpec - The specification of one meta type.
 */
function validateProps (data: MediaAssetFileFormat, typeSpec: TypeSpec) {
  function validateOneProp (spec: PropSpec, value: any, prop: PropName) {
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
 * @param data - An object containing some meta data.
 * @param typeSpec - The specification of one meta type.
 */
function removeProps (data: MediaAssetFileFormat, typeSpec: TypeSpec) {
  for (const propName in typeSpec.props) {
    if (data[propName]) {
      const value = data[propName]
      const propSpec = typeSpec.props[propName]
      if (
        !isValue(value) ||
        (propSpec.state && propSpec.state === 'absent') ||
        (
          propSpec.removeByRegexp &&
          propSpec.removeByRegexp instanceof RegExp &&
          typeof value === 'string' &&
          value.match(propSpec.removeByRegexp)
        )
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
 * @param data - An object containing some meta data.
 * @param typeName - The type name
 */
function processByType (data: MediaAssetFileFormat, typeName: TypeName): MediaAssetFileFormat {
  if (!typeSpecs[typeName]) {
    throw new Error(`Unkown meta type name: “${typeName}”`)
  }
  const typeSpec = typeSpecs[typeName]
  if (!typeSpec.props) {
    throw new Error(`The meta type “${typeName}” has no props.`)
  }

  if (typeSpec.initialize && typeof typeSpec.initialize === 'function') {
    data = typeSpec.initialize({ typeData: data, typeSpec })
  }

  data = sortAndDeriveProps(data, typeSpec)
  data = formatProps(data, typeSpec)
  // We need filePath in format. Must be after formatProps
  data = removeProps(data, typeSpec)

  validateProps(data, typeSpec)

  if (typeSpec.finalize && typeof typeSpec.finalize === 'function') {
    data = typeSpec.finalize({ typeData: data, typeSpec })
  }
  return data
}

/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param data - An object containing some meta data.
 */
function process (data: MediaAssetFileFormat): MediaAssetFileFormat {
  // The meta type specification is in camel case. The meta data is
  // stored in the YAML format in snake case
  data = <MediaAssetFileFormat> convertPropertiesSnakeToCamel(data)
  if (!data.metaTypes) {
    data.metaTypes = 'general'
  } else if (data.metaTypes.indexOf('general') === -1) {
    data.metaTypes = `${data.metaTypes},general`
  }
  if (data.metaTypes) {
    for (const typeName of data.metaTypes.split(',')) {
      data = processByType(data, typeName)
    }
  }
  // Do not convert back. This conversion should be the last step, before
  // object is converted to YAML.
  // convertProperties(data, 'camel-to-snake')
  return data
}

module.exports = {
  detectTypeByPath,
  formatFilePath,
  process,
  typeSpecs
}
