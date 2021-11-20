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
 *       masterWrapper.collectStepsEarly(..)
 *
 * presentation.resolve()
 *   masterWrapper.finalizeSlide(..) [master.ts]
 *     master.collectFields(..)
 *     master.collectStepsLate(..)
 * ```
 *
 * The different states of the master slide field types.
 *
 * - `..RawInput`
 * - `..Input`
 * - `..Instantiated`
 * - `..Resolved`
 *
 * Master slide “generic”:
 *
 * - `GenericRawInput`
 * - `GenericInput`
 * - `GenericInstantiated`
 * - `GenericResolved`
 *
 *
 * `..RawInput` ->
 * `master.normalizeFieldsInput(..)` ->
 * `..Input` ->
 * `master.collectFieldsOnInstantiation(..)` ->
 * `..Instantiated` ->
 * `master.collectFieldsAfterResolution(..)` ->
 * `..Resolved`
 *
 * @module @bldr/presentation-parser
 */

import { Presentation } from './presentation'

export { mapStepFieldDefintions } from './master'

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
