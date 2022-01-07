/**
 * Core functionality for the BALDR songbook without node dependencies.
 * @module @bldr/songbook-core
 */
export { SongMetaData, Song, DynamicSelectSong, SongMetaDataCombined } from './song';
export { AlphabeticalSongsTree, SongCollection, CoreLibrary } from './library';
export declare const songConstants: {
    intermediateFolder: string;
    firstSlideName: string;
    firstPianoName: string;
    slideRegExp: RegExp;
    pianoRegExp: RegExp;
};
