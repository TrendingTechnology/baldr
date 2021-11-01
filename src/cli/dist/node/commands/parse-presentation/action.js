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
const presentation_parser_1 = require("@bldr/presentation-parser");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const media_manager_1 = require("@bldr/media-manager");
/**
 * @param filePath - A file path.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(filePaths) {
    return __awaiter(this, void 0, void 0, function* () {
        yield media_manager_1.walk({
            presentation(presPath) {
                return __awaiter(this, void 0, void 0, function* () {
                    const presentation = yield presentation_parser_1.parseAndResolve(file_reader_writer_1.readFile(presPath));
                    presentation.log();
                });
            }
        }, {
            path: filePaths
        });
    });
}
module.exports = action;
