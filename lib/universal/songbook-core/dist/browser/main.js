/**
 * Core functionality for the BALDR songbook without node dependencies.
 * @module @bldr/songbook-core
 */
export { SongMetaDataCombined } from './song';
export { AlphabeticalSongsTree, CoreLibrary } from './library';
export const songConstants = {
    intermediateFolder: 'NB',
    firstSlideName: 'Projektor.svg',
    firstPianoName: 'Piano.eps',
    slideRegExp: /\.svg$/i,
    pianoRegExp: /\.eps$/i
};
