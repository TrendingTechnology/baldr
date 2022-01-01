/**
 * ```
 * presentation = new Presentation() [presentation.ts]
 *   new SlideCollection() [slide-collection.ts]
 *     new Slide(..) [slide.ts]
 *       Master.initializeFields(..)
 *         master.normalizeFieldsInput(..)
 *         master.collectFieldsOnInstantiation(..)
 *       Master.processMediaUris(..)
 *       Master.processOptionalMediaUris(..)
 *       Master.collectStepsOnInstation(..)
 *
 * presentation.resolve()
 *   Master.finalizeSlide(..) [master.ts]
 *     master.collectFields(..)
 *     master.collectStepsLate(..)
 * ```
 *
 * The different states of the master slide field types.
 *
 * - `..FieldsRawInput`
 * - `..FieldsInput`
 * - `..FieldsInstantiated`
 * - `..FieldsFinal`
 *
 * Master slide “generic”:
 *
 * - `GenericFieldsRawInput`
 * - `GenericFieldsInput`
 * - `GenericFieldsInstantiated`
 * - `GenericFieldsFinal`
 *
 * `..FieldsRawInput` ->
 * `master.normalizeFieldsInput(..)` -> (defaults) ->
 * `..FieldsInput` ->
 * `master.collectFieldsOnInstantiation(..)` ->
 * `..FieldsInstantiated` ->
 * `master.collectFieldsAfterResolution(..)` ->
 * `..FieldsFinal`
 *
 * @module @bldr/presentation-parser
 */
import { Presentation } from './presentation';
export { resolver, Presentation } from './presentation';
export { mapStepFieldDefintionsToProps, FieldDefinition, FieldDefinitionCollection } from './field';
export { Master } from './master-wrapper';
export { Slide } from './slide';
export { masterCollection, getMaster } from './master-collection';
export * as genericMModul from './masters/generic';
export * as questionMModul from './masters/question';
export * as wikipediaMModule from './masters/wikipedia';
export * as youtubeMModule from './masters/youtube';
export { Asset, Sample } from '@bldr/media-resolver-ng';
export { WrappedUriList } from './fuzzy-uri';
export declare function parse(yamlString: string): Presentation;
export declare function parseAndResolve(yamlString: string): Promise<Presentation>;
