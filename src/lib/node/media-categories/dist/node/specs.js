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
exports.stripCategories = exports.categories = void 0;
const core_browser_1 = require("@bldr/core-browser");
const cloze_1 = require("./specs/cloze");
const composition_1 = require("./specs/composition");
const cover_1 = require("./specs/cover");
const documentation_1 = require("./specs/documentation");
const excerpt_1 = require("./specs/excerpt");
const famousPiece_1 = require("./specs/famousPiece");
const _general_1 = require("./specs/_general");
const group_1 = require("./specs/group");
const instrument_1 = require("./specs/instrument");
const person_1 = require("./specs/person");
const photo_1 = require("./specs/photo");
const radio_1 = require("./specs/radio");
const recording_1 = require("./specs/recording");
const reference_1 = require("./specs/reference");
const sample_1 = require("./specs/sample");
const score_1 = require("./specs/score");
const song_1 = require("./specs/song");
const videoClip_1 = require("./specs/videoClip");
const worksheet_1 = require("./specs/worksheet");
const youtube_1 = require("./specs/youtube");
exports.categories = {
    cloze: cloze_1.cloze,
    composition: composition_1.composition,
    cover: cover_1.cover,
    documentation: documentation_1.documentation,
    excerpt: excerpt_1.excerpt,
    famousPiece: famousPiece_1.famousPiece,
    group: group_1.group,
    instrument: instrument_1.instrument,
    person: person_1.person,
    photo: photo_1.photo,
    radio: radio_1.radio,
    recording: recording_1.recording,
    reference: reference_1.reference,
    score: score_1.score,
    sample: sample_1.sample,
    song: song_1.song,
    videoClip: videoClip_1.videoClip,
    worksheet: worksheet_1.worksheet,
    youtube: youtube_1.youtube,
    // Applied to all
    general: _general_1.general
};
/**
 * Remove all properties that can not represented in JSON. Remove absent
 * properties.
 *
 * @returns A object that can be converted to JSON.
 */
function stripCategories() {
    // { [category: string]: MediaCategoriesTypes.Category }
    const cats = (0, core_browser_1.deepCopy)(exports.categories);
    for (const name in cats) {
        delete cats[name].detectCategoryByPath;
        const category = cats[name];
        for (const propName in category.props) {
            if (category.props[propName].wikidata != null) {
                category.props[propName].wikidata = true;
            }
            delete category.props[propName].removeByRegexp;
            if (category.props[propName].state === 'absent') {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete category.props[propName];
            }
        }
    }
    return cats;
}
exports.stripCategories = stripCategories;
