"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterCollection = void 0;
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
const master_wrapper_1 = require("./master-wrapper");
exports.masterCollection = {
    audio: new master_wrapper_1.Master(audio_1.AudioMaster),
    camera: new master_wrapper_1.Master(camera_1.CameraMaster),
    cloze: new master_wrapper_1.Master(cloze_1.ClozeMaster),
    counter: new master_wrapper_1.Master(counter_1.CounterMaster),
    document: new master_wrapper_1.Master(document_1.DocumentMaster),
    editor: new master_wrapper_1.Master(editor_1.EditorMaster),
    generic: new master_wrapper_1.Master(generic_1.GenericMaster),
    group: new master_wrapper_1.Master(group_1.GroupMaster),
    image: new master_wrapper_1.Master(image_1.ImageMaster),
    instrument: new master_wrapper_1.Master(instrument_1.InstrumentMaster),
    interactiveGraphic: new master_wrapper_1.Master(interactive_graphic_1.InteractiveGraphicMaster),
    note: new master_wrapper_1.Master(note_1.NoteMaster),
    person: new master_wrapper_1.Master(person_1.PersonMaster),
    question: new master_wrapper_1.Master(question_1.QuestionMaster),
    quote: new master_wrapper_1.Master(quote_1.QuoteMaster),
    sampleList: new master_wrapper_1.Master(sample_list_1.SampleListMaster),
    scoreSample: new master_wrapper_1.Master(score_sample_1.ScoreSampleMaster),
    section: new master_wrapper_1.Master(section_1.SectionMaster),
    song: new master_wrapper_1.Master(song_1.SongMaster),
    task: new master_wrapper_1.Master(task_1.TaskMaster),
    video: new master_wrapper_1.Master(video_1.VideoMaster),
    wikipedia: new master_wrapper_1.Master(wikipedia_1.WikipediaMaster),
    youtube: new master_wrapper_1.Master(youtube_1.YoutubeMaster)
};
