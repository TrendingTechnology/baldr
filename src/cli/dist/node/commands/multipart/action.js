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
Object.defineProperty(exports, "__esModule", { value: true });
// Node packages.
const fs_1 = __importDefault(require("fs"));
// Third party packages.
const glob_1 = __importDefault(require("glob"));
// Project packages.
const core_browser_1 = require("@bldr/core-browser");
const media_manager_1 = require("@bldr/media-manager");
const log = __importStar(require("@bldr/log"));
/**
 * Rename multipart assets. Example “b mp "*.jpg" Systeme”
 *
 * @param globPattern - For example `*.jpg`
 * @param prefix - For example `Systeme`
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(globPattern, prefix, cmdObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = glob_1.default.sync(globPattern);
        if (files.length < 1) {
            log.info('Glob matches no files.');
            return;
        }
        files.sort(undefined);
        let no = 1;
        const extension = core_browser_1.getExtension(files[0]);
        if (extension == null)
            throw Error('No extension');
        const firstNewFileName = `${prefix}.${extension}`;
        for (const oldFileName of files) {
            // Omit already existent info file by the renaming.
            if (oldFileName.match(/yml$/i) == null) {
                const newFileName = core_browser_1.formatMultiPartAssetFileName(`${prefix}.${extension}`, no);
                log.info('%s -> %s', [oldFileName, newFileName]);
                if (!cmdObj.dryRun)
                    fs_1.default.renameSync(oldFileName, newFileName);
                no += 1;
            }
        }
        if (fs_1.default.existsSync(firstNewFileName) && !cmdObj.dryRun) {
            yield media_manager_1.writeYamlMetaData(firstNewFileName);
            yield media_manager_1.operations.normalizeMediaAsset(firstNewFileName, { wikidata: false });
        }
    });
}
module.exports = action;
