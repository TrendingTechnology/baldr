"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAndResolve = exports.parse = exports.Sample = exports.Asset = exports.youtubeMModule = exports.wikipediaMModule = exports.questionMModul = exports.personMModul = exports.genericMModul = exports.getMaster = exports.masterCollection = exports.Slide = exports.Master = exports.mapStepFieldDefintionsToProps = exports.Presentation = exports.resolver = void 0;
const presentation_1 = require("./presentation");
var presentation_2 = require("./presentation");
Object.defineProperty(exports, "resolver", { enumerable: true, get: function () { return presentation_2.resolver; } });
Object.defineProperty(exports, "Presentation", { enumerable: true, get: function () { return presentation_2.Presentation; } });
var field_1 = require("./field");
Object.defineProperty(exports, "mapStepFieldDefintionsToProps", { enumerable: true, get: function () { return field_1.mapStepFieldDefintionsToProps; } });
var master_wrapper_1 = require("./master-wrapper");
Object.defineProperty(exports, "Master", { enumerable: true, get: function () { return master_wrapper_1.Master; } });
var slide_1 = require("./slide");
Object.defineProperty(exports, "Slide", { enumerable: true, get: function () { return slide_1.Slide; } });
var master_collection_1 = require("./master-collection");
Object.defineProperty(exports, "masterCollection", { enumerable: true, get: function () { return master_collection_1.masterCollection; } });
Object.defineProperty(exports, "getMaster", { enumerable: true, get: function () { return master_collection_1.getMaster; } });
// MModule = MasterModule
exports.genericMModul = require("./masters/generic");
exports.personMModul = require("./masters/person");
exports.questionMModul = require("./masters/question");
exports.wikipediaMModule = require("./masters/wikipedia");
exports.youtubeMModule = require("./masters/youtube");
var media_resolver_ng_1 = require("@bldr/media-resolver-ng");
Object.defineProperty(exports, "Asset", { enumerable: true, get: function () { return media_resolver_ng_1.Asset; } });
Object.defineProperty(exports, "Sample", { enumerable: true, get: function () { return media_resolver_ng_1.Sample; } });
function parse(yamlString) {
    return new presentation_1.Presentation(yamlString);
}
exports.parse = parse;
function parseAndResolve(yamlString) {
    return __awaiter(this, void 0, void 0, function* () {
        const presentation = new presentation_1.Presentation(yamlString);
        yield presentation.resolve();
        return presentation;
    });
}
exports.parseAndResolve = parseAndResolve;
