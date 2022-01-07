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
Object.defineProperty(exports, "__esModule", { value: true });
const media_manager_1 = require("@bldr/media-manager");
/**
 * Generate from TeX files with cloze texts SVGs for baldr.
 */
function action(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, media_manager_1.walk)(media_manager_1.operations.generateCloze, { regex: new RegExp('.*.tex$'), path: filePath } // eslint-disable-line
        );
    });
}
module.exports = action;
