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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Presentation } from './presentation';
export { mapStepFieldDefintions } from './master';
export function parse(yamlString) {
    return new Presentation(yamlString);
}
export function parseAndResolve(yamlString) {
    return __awaiter(this, void 0, void 0, function* () {
        const presentation = new Presentation(yamlString);
        yield presentation.resolve();
        return presentation;
    });
}
