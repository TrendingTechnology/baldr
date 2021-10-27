import { AudioMaster } from './audio'
import { CameraMaster } from './camera'
import { ClozeMaster } from './cloze'
import { CounterMaster } from './counter'
import { DocumentMaster } from './document'
import { EditorMaster } from './editor'
import { GenericMaster } from './generic'
import { GroupMaster } from './group'
import { ImageMaster } from './image'
import { InstrumentMaster } from './instrument'
import { InteractiveGraphicMaster } from './interactive-graphic'
import { NoteMaster } from './note'
import { PersonMaster } from './person'
import { QuestionMaster } from './question'
import { QuoteMaster } from './quote'
import { SampleListMaster } from './sample-list'
import { ScoreMaster } from './score'
import { SectionMaster } from './section'
import { SongMaster } from './song'
import { TaskMaster } from './task'
import { VideoMaster } from './video'
import { WikipediaMaster } from './wikipedia'
import { YoutubeMaster } from './youtube'

export abstract class Master {
  /**
   * The name of the master slide. A short name in lower case letters like `audio`.
   */
  abstract name: string

  /**
   * A human readable name of the master slide.
   */
  abstract displayName: string
}

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
  score: new ScoreMaster(),
  section: new SectionMaster(),
  song: new SongMaster(),
  task: new TaskMaster(),
  video: new VideoMaster(),
  wikipedia: new WikipediaMaster(),
  youtube: new YoutubeMaster()
}
