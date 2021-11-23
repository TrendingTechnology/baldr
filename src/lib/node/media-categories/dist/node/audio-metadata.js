"use strict";
/**
 * Cache the audio metadata.
 *
 * @module @bldr/media-categories/audio-metadata
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
exports.getAudioMetadataValue = void 0;
const audio_metadata_1 = require("@bldr/audio-metadata");
const cache = {};
function getAudioMetadata(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (cache[filePath] == null) {
            return yield (0, audio_metadata_1.collectAudioMetadata)(filePath);
        }
        return cache[filePath];
    });
}
function getAudioMetadataValue(fieldName, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (filePath != null) {
            const metadata = yield getAudioMetadata(filePath);
            if ((metadata === null || metadata === void 0 ? void 0 : metadata[fieldName]) != null) {
                return metadata[fieldName];
            }
        }
    });
}
exports.getAudioMetadataValue = getAudioMetadataValue;
