"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaster = exports.masterCollection = void 0;
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
const master_1 = require("./master");
exports.masterCollection = {
    audio: new master_1.MasterWrapper(audio_1.AudioMaster),
    camera: new master_1.MasterWrapper(camera_1.CameraMaster),
    cloze: new master_1.MasterWrapper(cloze_1.ClozeMaster),
    counter: new master_1.MasterWrapper(counter_1.CounterMaster),
    document: new master_1.MasterWrapper(document_1.DocumentMaster),
    editor: new master_1.MasterWrapper(editor_1.EditorMaster),
    generic: new master_1.MasterWrapper(generic_1.GenericMaster),
    group: new master_1.MasterWrapper(group_1.GroupMaster),
    image: new master_1.MasterWrapper(image_1.ImageMaster),
    instrument: new master_1.MasterWrapper(instrument_1.InstrumentMaster),
    interactiveGraphic: new master_1.MasterWrapper(interactive_graphic_1.InteractiveGraphicMaster),
    note: new master_1.MasterWrapper(note_1.NoteMaster),
    person: new master_1.MasterWrapper(person_1.PersonMaster),
    question: new master_1.MasterWrapper(question_1.QuestionMaster),
    quote: new master_1.MasterWrapper(quote_1.QuoteMaster),
    sampleList: new master_1.MasterWrapper(sample_list_1.SampleListMaster),
    scoreSample: new master_1.MasterWrapper(score_sample_1.ScoreSampleMaster),
    section: new master_1.MasterWrapper(section_1.SectionMaster),
    song: new master_1.MasterWrapper(song_1.SongMaster),
    task: new master_1.MasterWrapper(task_1.TaskMaster),
    video: new master_1.MasterWrapper(video_1.VideoMaster),
    wikipedia: new master_1.MasterWrapper(wikipedia_1.WikipediaMaster),
    youtube: new master_1.MasterWrapper(youtube_1.YoutubeMaster)
};
function getMaster(masterName) {
    return exports.masterCollection[masterName];
}
exports.getMaster = getMaster;
