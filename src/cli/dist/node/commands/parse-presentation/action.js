"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const api_wrapper_1 = require("@bldr/api-wrapper");
const media_manager_1 = require("@bldr/media-manager");
const log = __importStar(require("@bldr/log"));
/**
 * @param filePath - A file path.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(filePaths, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = {};
        const result = yield api_wrapper_1.updateMediaServer();
        log.infoAny(result);
        yield media_manager_1.walk({
            presentation(filePath) {
                return __awaiter(this, void 0, void 0, function* () {
                    log.info('Parse presentation %s', [filePath]);
                    try {
                        const presentation = presentation_parser_1.parse(file_reader_writer_1.readFile(filePath));
                        if ((options === null || options === void 0 ? void 0 : options.resolve) != null && options.resolve) {
                            yield presentation.resolve();
                        }
                        presentation.log();
                    }
                    catch (e) {
                        const error = e;
                        log.error(error.message);
                        errors[filePath] = error.message;
                    }
                });
            }
        }, {
            path: filePaths
        });
        if (Object.keys(errors).length === 0) {
            log.info('Congratulations! No parsing errors!');
        }
        else {
            log.error('Parsing errors');
            for (const filePath in errors) {
                if (Object.prototype.hasOwnProperty.call(errors, filePath)) {
                    const message = errors[filePath];
                    log.error('Error in file “%s”:\n    %s', [filePath, message]);
                }
            }
        }
    });
}
module.exports = action;
