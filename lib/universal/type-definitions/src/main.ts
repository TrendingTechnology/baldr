/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions
 */

export interface StringIndexedObject { [key: string]: any }

export interface StringIndexedStringIndexedData { [key: string]: string }

export interface GenericError {
  name: string
  message: string
  code: string
}

/**
 * Types from specific packages.
 *
 * Naming convention: Title case package name + `Types`
 *
 * for example @bldr/titles -> TitlesTypes
 */

export * as ApiTypes from './api'
export * as CliTypes from './cli'
export * as LampTypes from './lamp'
export * as MediaCategoriesTypes from './media-categories'
export * as MediaDataTypes from './media-data'
export * as TitlesTypes from './titles'
export * as IconFontGeneratorTypes from './icon-font-generator'