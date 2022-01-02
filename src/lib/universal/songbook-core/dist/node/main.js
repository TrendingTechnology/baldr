"use strict";
/**
 * Core functionality for the BALDR songbook without node dependencies.
 * @module @bldr/songbook-core
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.songConstants = exports.CoreLibrary = exports.AlphabeticalSongsTree = exports.SongMetaDataCombined = void 0;
var song_1 = require("./song");
Object.defineProperty(exports, "SongMetaDataCombined", { enumerable: true, get: function () { return song_1.SongMetaDataCombined; } });
var library_1 = require("./library");
Object.defineProperty(exports, "AlphabeticalSongsTree", { enumerable: true, get: function () { return library_1.AlphabeticalSongsTree; } });
Object.defineProperty(exports, "CoreLibrary", { enumerable: true, get: function () { return library_1.CoreLibrary; } });
exports.songConstants = {
    intermediateFolder: 'NB',
    firstSlideName: 'Projektor.svg',
    firstPianoName: 'Piano.eps',
    slideRegExp: /\.svg$/i,
    pianoRegExp: /\.eps$/i
};
