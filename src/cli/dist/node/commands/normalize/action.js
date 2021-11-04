"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const media_manager_1 = require("@bldr/media-manager");
/**
 * Execute different normalization tasks.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
function action(filePaths, opts) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let filter;
        if ((_a = opts === null || opts === void 0 ? void 0 : opts.presentation) !== null && _a !== void 0 ? _a : false) {
            filter = 'presentation';
        }
        else if ((_b = opts === null || opts === void 0 ? void 0 : opts.tex) !== null && _b !== void 0 ? _b : false) {
            filter = 'tex';
        }
        else if ((_c = opts === null || opts === void 0 ? void 0 : opts.asset) !== null && _c !== void 0 ? _c : false) {
            filter = 'asset';
        }
        yield media_manager_1.operations.normalize(filePaths, filter);
    });
}
module.exports = action;
