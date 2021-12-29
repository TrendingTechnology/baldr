/**
 * ```
 * presentation = new Presentation() [presentation.ts]
 *   new SlideCollection() [slide-collection.ts]
 *     new Slide(..) [slide.ts]
 *       masterWrapper.initializeFields(..)
 *         master.normalizeFieldsInput(..)
 *         master.collectFieldsOnInstantiation(..)
 *       masterWrapper.processMediaUris(..)
 *       masterWrapper.processOptionalMediaUris(..)
 *       masterWrapper.collectStepsOnInstation(..)
 *
 * presentation.resolve()
 *   masterWrapper.finalizeSlide(..) [master.ts]
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

import { Presentation } from './presentation'

export { resolver, Presentation } from './presentation'

export { mapStepFieldDefintionsToProps } from './master'
export { Slide } from './slide'

// MModule = MasterModule
export * as genericMModul from './masters/generic'
export * as questionMModul from './masters/question'
export * as wikipediaMModule from './masters/wikipedia'
export * as youtubeMModule from './masters/youtube'

export { Asset, Sample } from '@bldr/media-resolver-ng'

export { WrappedUriList } from './fuzzy-uri'

export function parse (yamlString: string): Presentation {
  return new Presentation(yamlString)
}

export async function parseAndResolve (
  yamlString: string
): Promise<Presentation> {
  const presentation = new Presentation(yamlString)
  await presentation.resolve()
  return presentation
}
