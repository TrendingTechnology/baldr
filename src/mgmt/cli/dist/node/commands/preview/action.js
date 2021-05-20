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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const path_1 = __importDefault(require("path"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
const log = __importStar(require("@bldr/log"));
const cli_utils_1 = require("@bldr/cli-utils");
const cmd = new cli_utils_1.CommandRunner({ verbose: true });
/**
 * Create a video preview image.
 */
function createVideoPreview(srcPath, destPath, second = 10) {
    return __awaiter(this, void 0, void 0, function* () {
        let secondString;
        if (typeof second === 'number') {
            secondString = second.toString();
        }
        else {
            secondString = second;
        }
        yield cmd.exec(['ffmpeg',
            '-i', srcPath,
            '-ss', secondString,
            '-vframes', '1',
            '-qscale:v', '10',
            '-y',
            destPath
        ]);
    });
}
function createPdfPreview(srcPath, destPath) {
    return __awaiter(this, void 0, void 0, function* () {
        cmd.exec(['magick',
            'convert', `${srcPath}[0]`, destPath
        ]);
    });
}
function createPreviewOneFile(srcPath, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const mimeType = media_manager_1.filePathToMimeType(srcPath);
        const destPath = `${srcPath}_preview.jpg`;
        const destFileName = path_1.default.basename(destPath);
        log.info('Create preview image %s of %s file.', destFileName, mimeType);
        if (mimeType === 'video') {
            yield createVideoPreview(srcPath, destPath, cmdObj.second);
        }
        else if (mimeType === 'document') {
            yield createPdfPreview(srcPath, destPath);
        }
    });
}
/**
 * Create preview images.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(filePaths, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        yield media_manager_1.walk({
            asset(relPath) {
                createPreviewOneFile(relPath, cmdObj);
            }
        }, {
            path: filePaths
        });
    });
}
module.exports = action;
