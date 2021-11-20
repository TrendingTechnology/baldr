/**
 * ```
 * presentation = new Presentation() [presentation.ts]
 *   new SlideCollection() [slide-collection.ts]
 *     new Slide(...) [slide.ts]
 *       masterWrapper.initializeFields(...)
 *       masterWrapper.processMediaUris(...)
 *       masterWrapper.processOptionalMediaUris(...)
 *       masterWrapper.collectStepsEarly(...)
 *
 * presentation.resolve()
 *   masterWrapper.finalizeSlide(...) [master.ts]
 *     master.collectFields(...)
 *     master.collectStepsLate(...)
 * ```
 * @module @bldr/presentation-parser
 */
import { Presentation } from './presentation';
export { mapStepFieldDefintions } from './master';
export declare function parse(yamlString: string): Presentation;
export declare function parseAndResolve(yamlString: string): Promise<Presentation>;
