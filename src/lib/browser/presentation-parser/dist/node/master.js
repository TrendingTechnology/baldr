"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterCollection = exports.Master = void 0;
const audio_1 = require("./masters/audio");
const camera_1 = require("./masters/camera");
const cloze_1 = require("./masters/cloze");
const counter_1 = require("./masters/counter");
const document_1 = require("./masters/document");
const editor_1 = require("./masters/editor");
const generic_1 = require("./masters/generic");
const group_1 = require("./masters/group");
const image_1 = require("./masters/image");
const instrument_1 = require("./masters/instrument");
const interactive_graphic_1 = require("./masters/interactive-graphic");
const note_1 = require("./masters/note");
const person_1 = require("./masters/person");
const question_1 = require("./masters/question");
const quote_1 = require("./masters/quote");
const sample_list_1 = require("./masters/sample-list");
const score_sample_1 = require("./masters/score-sample");
const section_1 = require("./masters/section");
const song_1 = require("./masters/song");
const task_1 = require("./masters/task");
const video_1 = require("./masters/video");
const wikipedia_1 = require("./masters/wikipedia");
const youtube_1 = require("./masters/youtube");
class Master {
    /**
     * The result must correspond to the fields definition.
     *
     * Called during the parsing the YAML file (`Praesentation.baldr.yml`)
     *
     * ```js
     * normalizeFields (props) {
     *   if (typeof props === 'string') {
     *     return {
     *       markup: props
     *     }
     *   }
     * }
     * ```
     */
    normalizeFields(fields) {
        return fields;
    }
}
exports.Master = Master;
exports.masterCollection = {
    audio: new audio_1.AudioMaster(),
    camera: new camera_1.CameraMaster(),
    cloze: new cloze_1.ClozeMaster(),
    counter: new counter_1.CounterMaster(),
    document: new document_1.DocumentMaster(),
    editor: new editor_1.EditorMaster(),
    generic: new generic_1.GenericMaster(),
    group: new group_1.GroupMaster(),
    image: new image_1.ImageMaster(),
    instrument: new instrument_1.InstrumentMaster(),
    interactiveGraphic: new interactive_graphic_1.InteractiveGraphicMaster(),
    note: new note_1.NoteMaster(),
    person: new person_1.PersonMaster(),
    question: new question_1.QuestionMaster(),
    quote: new quote_1.QuoteMaster(),
    sampleList: new sample_list_1.SampleListMaster(),
    scoreSample: new score_sample_1.ScoreSampleMaster(),
    section: new section_1.SectionMaster(),
    song: new song_1.SongMaster(),
    task: new task_1.TaskMaster(),
    video: new video_1.VideoMaster(),
    wikipedia: new wikipedia_1.WikipediaMaster(),
    youtube: new youtube_1.YoutubeMaster()
};
