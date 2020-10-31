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
import { deepCopy, getExtension, convertPropertiesSnakeToCamel } from '@bldr/core-browser'
import  config from '@bldr/config'
import { MetaSpec, AssetType, DeepTitleInterface } from '@bldr/type-definitions'

import { DeepTitle } from './titles'
import typeSpecs from './meta-type-specs'

/**
 * Check a file path against a regular expression to get the type name.
 *
 * @param filePath
 *
 * @returns The type names for example `person,group,general`
 */
function detectTypeByPath (filePath: string): MetaSpec.TypeNames | undefined {
  filePath = path.resolve(filePath)
  const typeNames = new Set()
  for (const typeName in typeSpecs) {
    const typeSpec = typeSpecs[<MetaSpec.TypeName> typeName]
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
function formatFilePath (data: AssetType.FileFormat, oldPath?: string): string {
  if (!data.metaTypes) throw new Error(`Your data needs a property named “metaTypes”.`)
  // TODO: support multiple types
  // person,general -> person
  const typeName = <MetaSpec.TypeName> data.metaTypes.replace(/,.*$/, '')
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
  let oldRelPath = ''
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
function applySpecToProps (data: AssetType.Generic, func: Function, typeSpec: MetaSpec.Type, replaceValues: boolean = true) {
  function applyOneTypeSpec (props: MetaSpec.PropCollection, propName: AssetType.PropName, data: AssetType.Generic, func: Function, replaceValues: boolean) {
    const propSpec = props[propName]
    const value = func(propSpec, data[propName], propName)
    if (replaceValues && isValue(value)) {
      data[propName] = value
    }
  }
  const propSpecs = typeSpec.props
  for (const propName in propSpecs) {
    applyOneTypeSpec(propSpecs, <AssetType.PropName> propName, data, func, replaceValues)
  }
  return data
}

/**
 * @param propSpec - The
 *   specification of one property
 */
function isPropertyDerived (propSpec: MetaSpec.Prop) {
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
function sortAndDeriveProps (data: AssetType.Generic, typeSpec: MetaSpec.Type): AssetType.Generic {
  const origData = <AssetType.Generic> deepCopy(data)
  const result = <AssetType.Generic>{}

  let folderTitles
  let filePath
  if (data.filePath) {
    filePath = data.filePath
    folderTitles = new DeepTitle(data.filePath)
  }

  // Loop over the propSpecs to get a sorted object
  const propSpecs = typeSpec.props
  for (const propName in propSpecs) {
    const propSpec = propSpecs[<AssetType.PropName> propName]
    const origValue = origData[propName]
    let derivedValue
    if (isPropertyDerived(propSpec) && propSpec.derive) {
      derivedValue = propSpec.derive({ typeData: data, typeSpec, folderTitles: <DeepTitleInterface> folderTitles, filePath })
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
function formatProps (data: AssetType.Generic, typeSpec: MetaSpec.Type) {
  function formatOneProp (spec: MetaSpec.Prop, value: any) {
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
function validateProps (data: AssetType.Generic, typeSpec: MetaSpec.Type) {
  function validateOneProp (spec: MetaSpec.Prop, value: any, prop: MetaSpec.PropName) {
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
function removeProps (data: AssetType.Generic, typeSpec: MetaSpec.Type): AssetType.Generic {
  for (const propName in typeSpec.props) {
    if (data[propName]) {
      const value = data[propName]
      const propSpec = typeSpec.props[<AssetType.PropName> propName]
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
function processByType (data: AssetType.Generic, typeName: MetaSpec.TypeName): AssetType.Generic {
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
 * Merge type names to avoid duplicate metadata type names:
 */
function mergeTypeNames (...typeName: string[]): string {
  const types = new Set()
  for (let i = 0; i < arguments.length; i++) {
    const typeNames = arguments[i]
    if (typeNames) {
      for (const typeName of typeNames.split(',')) {
        types.add(typeName)
      }
    }
  }
  return [...types].join(',')
}

/**
 * Bundle three operations: Sort and derive, format, validate.
 *
 * @param data - An object containing some meta data.
 */
function process (data: AssetType.Generic): AssetType.Generic {
  // The meta type specification is in camel case. The meta data is
  // stored in the YAML format in snake case
  data = <AssetType.FileFormat> convertPropertiesSnakeToCamel(data)
  if (!data.metaTypes) {
    data.metaTypes = 'general'
  } else if (data.metaTypes.indexOf('general') === -1) {
    data.metaTypes = `${data.metaTypes},general`
  }
  if (data.metaTypes) {
    for (const typeName of data.metaTypes.split(',')) {
      data = processByType(data, <MetaSpec.TypeName> typeName)
    }
  }
  // Do not convert back. This conversion should be the last step, before
  // object is converted to YAML.
  // convertProperties(data, 'camel-to-snake')
  return data
}

export default {
  detectTypeByPath,
  formatFilePath,
  process,
  typeSpecs,
  mergeTypeNames
}
