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
export { mapStepFieldDefintionsToProps } from './field';
export { Master } from './master-wrapper';
export { Slide } from './slide';
export { masterCollection, getMaster } from './master-collection';
import * as genericMModul_1 from './masters/generic';
export { genericMModul_1 as genericMModul };
import * as personMModul_1 from './masters/person';
export { personMModul_1 as personMModul };
import * as questionMModul_1 from './masters/question';
export { questionMModul_1 as questionMModul };
import * as wikipediaMModule_1 from './masters/wikipedia';
export { wikipediaMModule_1 as wikipediaMModule };
import * as youtubeMModule_1 from './masters/youtube';
export { youtubeMModule_1 as youtubeMModule };
export { Asset, Sample } from '@bldr/media-resolver';
export { WrappedUriList } from '@bldr/client-media-models';
export function parse(yamlString) {
    return new Presentation(yamlString);
}
export async function parseAndResolve(yamlString) {
    const presentation = new Presentation(yamlString);
    await presentation.resolve();
    return presentation;
}
