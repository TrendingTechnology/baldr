"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterCollection = exports.Master = void 0;
const audio_1 = require("./audio");
const camera_1 = require("./camera");
const cloze_1 = require("./cloze");
const counter_1 = require("./counter");
const document_1 = require("./document");
const editor_1 = require("./editor");
const generic_1 = require("./generic");
const group_1 = require("./group");
const image_1 = require("./image");
const instrument_1 = require("./instrument");
const interactive_graphic_1 = require("./interactive-graphic");
const note_1 = require("./note");
const person_1 = require("./person");
const question_1 = require("./question");
const quote_1 = require("./quote");
const sample_list_1 = require("./sample-list");
const score_1 = require("./score");
const section_1 = require("./section");
const song_1 = require("./song");
const task_1 = require("./task");
const video_1 = require("./video");
const wikipedia_1 = require("./wikipedia");
const youtube_1 = require("./youtube");
class Master {
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
    score: new score_1.ScoreMaster(),
    section: new section_1.SectionMaster(),
    song: new song_1.SongMaster(),
    task: new task_1.TaskMaster(),
    video: new video_1.VideoMaster(),
    wikipedia: new wikipedia_1.WikipediaMaster(),
    youtube: new youtube_1.YoutubeMaster()
};
