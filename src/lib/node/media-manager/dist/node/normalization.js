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
exports.normalize = void 0;
/**
 * Bundle all operations in an object
 */
const fs_1 = __importDefault(require("fs"));
const yaml_1 = require("@bldr/yaml");
const core_browser_1 = require("@bldr/core-browser");
const log = __importStar(require("@bldr/log"));
const presentation_parser_1 = require("@bldr/presentation-parser");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const api_wrapper_1 = require("@bldr/api-wrapper");
const directory_tree_walk_1 = require("./directory-tree-walk");
const tex_1 = require("./tex");
const presentationOperations = __importStar(require("./presentation"));
const txtOperations = __importStar(require("./txt"));
const assetOperations = __importStar(require("./asset"));
/**
 * Indicates if the media server was updated in the current run of the program.
 */
let mediaServerUpdated = false;
function validateYamlOneFile(filePath) {
    try {
        (0, yaml_1.convertFromYamlRaw)(fs_1.default.readFileSync(filePath, 'utf8'));
        log.debug('Valid YAML file: %s', [filePath]);
    }
    catch (error) {
        const e = error;
        log.error('Invalid YAML file %s. Error: %s: %s', [
            filePath,
            e.name,
            e.message
        ]);
        throw new Error(e.name);
    }
}
function normalizeAsset(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const yamlFile = `${filePath}.yml`;
        if (!fs_1.default.existsSync(yamlFile)) {
            yield assetOperations.initializeMetaYaml(filePath);
        }
        else {
            yield assetOperations.normalizeMediaAsset(filePath);
        }
        assetOperations.renameByRef(filePath);
        txtOperations.fixTypography(yamlFile);
    });
}
function normalizeEveryFile(filePath) {
    var _a;
    const extension = (_a = (0, core_browser_1.getExtension)(filePath)) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (extension != null && extension === 'txt') {
        txtOperations.fixTypography(filePath);
    }
    if (filePath.match(/\.yml$/i) != null) {
        validateYamlOneFile(filePath);
    }
    else if (filePath.match(/\.svg$/i) != null) {
        txtOperations.removeWidthHeightInSvg(filePath);
    }
}
function normalizePresentation(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        presentationOperations.normalizePresentationFile(filePath);
        log.verbose('Generate presentation automatically on path %s:', [filePath]);
        yield presentationOperations.generateAutomaticPresentation(filePath);
        txtOperations.fixTypography(filePath);
        if (!mediaServerUpdated) {
            yield (0, api_wrapper_1.updateMediaServer)();
            mediaServerUpdated = true;
        }
        const presentation = yield (0, presentation_parser_1.parseAndResolve)((0, file_reader_writer_1.readFile)(filePath));
        presentation.log();
    });
}
function normalizeTex(filePath) {
    log.info('\nPatch the titles of the TeX file “%s”', [filePath]);
    (0, tex_1.patchTexTitles)(filePath);
    txtOperations.fixTypography(filePath);
}
/**
 * Execute different normalization tasks.
 *
 * @param filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
function normalize(filePaths, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        if (filePaths.length === 0) {
            filePaths = [process.cwd()];
        }
        // `baldr normalize video.mp4.yml` only validates the YAML structure. We have
        // to call `baldr normalize video.mp4` to get the full normalization of the
        // metadata file video.mp4.yml.
        if (filePaths.length === 1 &&
            filePaths[0].match(/\.yml$/) != null &&
            filePaths[0].match(/\.baldr\.yml$/) == null) {
            filePaths[0] = filePaths[0].replace(/\.yml$/, '');
        }
        let functionBundle = {};
        if (filter == null) {
            functionBundle = {
                asset: normalizeAsset,
                everyFile: normalizeEveryFile,
                presentation: normalizePresentation,
                tex: normalizeTex
            };
        }
        else if (filter === 'presentation') {
            log.info('Normalize only presentations');
            functionBundle = {
                presentation: normalizePresentation
            };
        }
        else if (filter === 'tex') {
            log.info('Normalize only TeX files');
            functionBundle = {
                tex: normalizeTex
            };
        }
        else if (filter === 'asset') {
            log.info('Normalize only assets');
            functionBundle = {
                asset: normalizeAsset
            };
        }
        yield (0, directory_tree_walk_1.walk)(functionBundle, {
            path: filePaths
        });
    });
}
exports.normalize = normalize;
