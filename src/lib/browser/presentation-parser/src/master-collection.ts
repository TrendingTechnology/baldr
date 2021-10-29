import { AudioMaster } from './masters/audio'
import { CameraMaster } from './masters/camera'
import { ClozeMaster } from './masters/cloze'
import { CounterMaster } from './masters/counter'
import { DocumentMaster } from './masters/document'
import { EditorMaster } from './masters/editor'
import { GenericMaster } from './masters/generic'
import { GroupMaster } from './masters/group'
import { ImageMaster } from './masters/image'
import { InstrumentMaster } from './masters/instrument'
import { InteractiveGraphicMaster } from './masters/interactive-graphic'
import { NoteMaster } from './masters/note'
import { PersonMaster } from './masters/person'
import { QuestionMaster } from './masters/question'
import { QuoteMaster } from './masters/quote'
import { SampleListMaster } from './masters/sample-list'
import { ScoreSampleMaster } from './masters/score-sample'
import { SectionMaster } from './masters/section'
import { SongMaster } from './masters/song'
import { TaskMaster } from './masters/task'
import { VideoMaster } from './masters/video'
import { WikipediaMaster } from './masters/wikipedia'
import { YoutubeMaster } from './masters/youtube'

import { Master } from './master'

export const masterCollection: { [masterName: string]: Master } = {
  audio: new AudioMaster(),
  camera: new CameraMaster(),
  cloze: new ClozeMaster(),
  counter: new CounterMaster(),
  document: new DocumentMaster(),
  editor: new EditorMaster(),
  generic: new GenericMaster(),
  group: new GroupMaster(),
  image: new ImageMaster(),
  instrument: new InstrumentMaster(),
  interactiveGraphic: new InteractiveGraphicMaster(),
  note: new NoteMaster(),
  person: new PersonMaster(),
  question: new QuestionMaster(),
  quote: new QuoteMaster(),
  sampleList: new SampleListMaster(),
  scoreSample: new ScoreSampleMaster(),
  section: new SectionMaster(),
  song: new SongMaster(),
  task: new TaskMaster(),
  video: new VideoMaster(),
  wikipedia: new WikipediaMaster(),
  youtube: new YoutubeMaster()
}
