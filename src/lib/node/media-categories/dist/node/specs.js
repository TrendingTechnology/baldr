"use strict";
/**
 * This module contains the specification of the meta data types.
 *
 * A media asset can be attached to multiple meta data types (for example:
 * `meta_types: recording,composition`). All meta data types belong to the type
 * `general`.
 *
 * The corresponding module is called
 * {@link module:@bldr/media-server/meta-types}
 *
 * Some meta data type properties can be enriched by using
 * {@link module:@bldr/wikidata wikidata}.
 *
 * @module @bldr/media-manager/meta-type-specs
 */
Object.defineProperty(exports, "__esModule", { value: true });
const cloze_1 = require("./specs/cloze");
const composition_1 = require("./specs/composition");
const cover_1 = require("./specs/cover");
const group_1 = require("./specs/group");
const instrument_1 = require("./specs/instrument");
const person_1 = require("./specs/person");
const photo_1 = require("./specs/photo");
const radio_1 = require("./specs/radio");
const recording_1 = require("./specs/recording");
const reference_1 = require("./specs/reference");
const score_1 = require("./specs/score");
const song_1 = require("./specs/song");
const worksheet_1 = require("./specs/worksheet");
const youtube_1 = require("./specs/youtube");
const _general_1 = require("./specs/_general");
exports.default = {
    cloze: cloze_1.cloze,
    composition: composition_1.composition,
    cover: cover_1.cover,
    group: group_1.group,
    instrument: instrument_1.instrument,
    person: person_1.person,
    photo: photo_1.photo,
    radio: radio_1.radio,
    recording: recording_1.recording,
    reference: reference_1.reference,
    score: score_1.score,
    song: song_1.song,
    worksheet: worksheet_1.worksheet,
    youtube: youtube_1.youtube,
    // Applied to all
    general: _general_1.general
};
