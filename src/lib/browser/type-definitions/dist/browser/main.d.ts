/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions
 */
export * as AssetType from './asset';
export * from './cli';
export * from './config';
export * as MasterTypes from './master';
export * as PresentationTypes from './presentation';
export interface StringIndexedObject {
    [key: string]: any;
}
export interface StringIndexedStringObject {
    [key: string]: string;
}
export interface GenericError {
    name: string;
    message: string;
}
/**
 * Types from specific packages.
 *
 * Naming convention: Title case package name + `Types`
 *
 * for example @bldr/titles -> TitlesTypes
 */
export * as MediaCategoriesTypes from './media-categories';
export * as TitlesTypes from './titles';
