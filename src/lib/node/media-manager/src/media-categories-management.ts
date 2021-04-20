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
import { deepCopy, getExtension } from '@bldr/core-browser'
import { convertPropertiesSnakeToCamel } from '@bldr/yaml'
import config from '@bldr/config'
import { MediaCategory, AssetType, DeepTitleInterface } from '@bldr/type-definitions'

import { DeepTitle } from './titles'
import categories from './media-categories-specs'
import { checkTypeAbbreviations } from './two-letter-abbreviations'

checkTypeAbbreviations(categories)

/**
 * Check a file path against a regular expression to get the type name.
 *
 * @param filePath
 *
 * @returns The type names for example `person,group,general`
 */
function detectCategoryByPath (filePath: string): MediaCategory.Names | undefined {
  filePath = path.resolve(filePath)
  const typeNames = new Set()
  for (const typeName in categories) {
    const category = categories[<MediaCategory.Name> typeName]
    if (category.detectCategoryByPath != null) {
      let regexp
      if (typeof category.detectCategoryByPath === 'function') {
        regexp = category.detectCategoryByPath(category)
      } else {
        regexp = category.detectCategoryByPath
      }
      if (filePath.match(regexp) != null) typeNames.add(typeName)
    }
  }
  typeNames.add('general')
  if (typeNames.size) return [...typeNames].join(',')
}

/**
 * Generate the file path of the first specifed meta type.
 *
 * @param data - The mandatory property is “categories” and “extension”.
 *   One can omit the property “extension”, but than you have to specify
 *   the property “mainImage”.
 * @param oldPath - The old file path.
 *
 * @returns A absolute path
 */
function formatFilePath (data: AssetType.FileFormat, oldPath?: string): string {
  if (!data.categories) throw new Error('Your data needs a property named “categories”.')
  // TODO: support multiple types
  // person,general -> person
  const typeName = <MediaCategory.Name> data.categories.replace(/,.*$/, '')
  const category = categories[typeName]
  if (!category) throw new Error(`Unkown meta type “${typeName}”.`)

  if ((category.relPath == null) || typeof category.relPath !== 'function') {
    return ''
  }

  // The relPath function needs this.extension.
  if (!data.extension) {
    if (!data.mainImage) throw new Error('Your data needs a property named “mainImage”.')
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
  const relPath = category.relPath({ data, category, oldRelPath })
  if (!relPath) throw new Error(`The relPath() function has to return a string for meta type “${typeName}”`)
  // To avoid confusion with class MediaFile in the module @bldr/media-client
  delete data.extension
  const basePath = category.basePath ? category.basePath : config.mediaServer.basePath
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
 * @param category - The specification of one meta type.
 * @param replaceValues - Replace the values in the metadata object.
 */
function applySpecToProps (data: AssetType.Generic, func: Function, category: MediaCategory.Category, replaceValues: boolean = true) {
  function applyOneTypeSpec (props: MediaCategory.PropCollection, propName: AssetType.PropName, data: AssetType.Generic, func: Function, replaceValues: boolean) {
    const propSpec = props[propName]
    const value = func(propSpec, data[propName], propName)
    if (replaceValues && isValue(value)) {
      data[propName] = value
    }
  }
  const propSpecs = category.props
  for (const propName in propSpecs) {
    applyOneTypeSpec(propSpecs, <AssetType.PropName> propName, data, func, replaceValues)
  }
  return data
}

/**
 * @param propSpec - The
 *   specification of one property
 */
function isPropertyDerived (propSpec: MediaCategory.Prop) {
  if (propSpec && (propSpec.derive != null) && typeof propSpec.derive === 'function') {
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
 * @param category - The specification of one meta type.
 */
function sortAndDeriveProps (data: AssetType.Generic, category: MediaCategory.Category): AssetType.Generic {
  const origData = <AssetType.Generic> deepCopy(data)
  const result = <AssetType.Generic>{}

  let folderTitles
  let filePath
  if (data.filePath) {
    filePath = data.filePath
    folderTitles = new DeepTitle(data.filePath)
  }

  // Loop over the propSpecs to get a sorted object
  const propSpecs = category.props
  for (const propName in propSpecs) {
    const propSpec = propSpecs[<AssetType.PropName> propName]
    const origValue = origData[propName]
    let derivedValue
    if (isPropertyDerived(propSpec) && (propSpec.derive != null)) {
      derivedValue = propSpec.derive({ data, category, folderTitles: <DeepTitleInterface> folderTitles, filePath })
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
 * @param category - The type name
 */
function formatProps (data: AssetType.Generic, category: MediaCategory.Category) {
  function formatOneProp (spec: MediaCategory.Prop, value: any) {
    if (
      isValue(value) &&
      (spec.format != null) &&
      typeof spec.format === 'function'
    ) {
      return spec.format(value, { data, category })
    }
    return value
  }
  return applySpecToProps(data, formatOneProp, category)
}

/**
 * @param data - An object containing some meta data.
 * @param category - The specification of one meta type.
 */
function validateProps (data: AssetType.Generic, category: MediaCategory.Category) {
  function validateOneProp (spec: MediaCategory.Prop, value: any, prop: MediaCategory.PropName) {
    // required
    if (spec.required && !isValue(value)) {
      throw new Error(`Missing property ${prop}`)
    }
    // validate
    if ((spec.validate != null) && typeof spec.validate === 'function' && isValue(value)) {
      const result = spec.validate(value)
      if (!result) {
        throw new Error(`Validation failed for property “${prop}” and value “${value}”`)
      }
    }
  }
  applySpecToProps(data, validateOneProp, category, false)
}

/**
 * Delete properties from the data.
 *
 * @param data - An object containing some meta data.
 * @param category - The specification of one meta type.
 */
function removeProps (data: AssetType.Generic, category: MediaCategory.Category): AssetType.Generic {
  for (const propName in category.props) {
    if (data[propName]) {
      const value = data[propName]
      const propSpec = category.props[<AssetType.PropName> propName]
      if (
        !isValue(value) ||
        (propSpec.state && propSpec.state === 'absent') ||
        (
          (propSpec.removeByRegexp != null) &&
          propSpec.removeByRegexp instanceof RegExp &&
          typeof value === 'string' &&
          (value.match(propSpec.removeByRegexp) != null)
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
function processByType (data: AssetType.Generic, typeName: MediaCategory.Name): AssetType.Generic {
  if (!categories[typeName]) {
    throw new Error(`Unkown meta type name: “${typeName}”`)
  }
  const category = categories[typeName]
  if (!category.props) {
    throw new Error(`The meta type “${typeName}” has no props.`)
  }

  if ((category.initialize != null) && typeof category.initialize === 'function') {
    data = category.initialize({ data, category })
  }

  data = sortAndDeriveProps(data, category)
  data = formatProps(data, category)
  // We need filePath in format. Must be after formatProps
  data = removeProps(data, category)

  validateProps(data, category)

  if ((category.finalize != null) && typeof category.finalize === 'function') {
    data = category.finalize({ data, category })
  }
  return data
}

/**
 * Merge type names to avoid duplicate metadata type names:
 */
function mergeNames (...typeName: string[]): string {
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
  if (!data.categories) {
    data.categories = 'general'
  } else if (data.categories.indexOf('general') === -1) {
    data.categories = `${data.categories},general`
  }
  if (data.categories) {
    for (const typeName of data.categories.split(',')) {
      data = processByType(data, <MediaCategory.Name> typeName)
    }
  }
  // Do not convert back. This conversion should be the last step, before
  // object is converted to YAML.
  // convertProperties(data, 'camel-to-snake')
  return data
}

export default {
  detectCategoryByPath,
  formatFilePath,
  process,
  categories,
  mergeNames
}
