/**
 * Some basic Typescript interfaces and type defintions.
 *
 * @module @bldr/type-definitions
 */
export * as AssetType from './asset';
export * from './cli';
export * from './config';
export * as MetaSpec from './meta-spec';
export * from './titles';
export * as MasterTypes from './master';
export * as PresentationTypes from './presentation';
export interface StringIndexedObject {
    [key: string]: any;
}
export interface StringIndexedStringObject {
    [key: string]: string;
}
