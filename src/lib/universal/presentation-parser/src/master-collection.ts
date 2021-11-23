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

import { MasterWrapper } from './master'

export const masterCollection: { [masterName: string]: MasterWrapper } = {
  audio: new MasterWrapper(AudioMaster),
  camera: new MasterWrapper(CameraMaster),
  cloze: new MasterWrapper(ClozeMaster),
  counter: new MasterWrapper(CounterMaster),
  document: new MasterWrapper(DocumentMaster),
  editor: new MasterWrapper(EditorMaster),
  generic: new MasterWrapper(GenericMaster),
  group: new MasterWrapper(GroupMaster),
  image: new MasterWrapper(ImageMaster),
  instrument: new MasterWrapper(InstrumentMaster),
  interactiveGraphic: new MasterWrapper(InteractiveGraphicMaster),
  note: new MasterWrapper(NoteMaster),
  person: new MasterWrapper(PersonMaster),
  question: new MasterWrapper(QuestionMaster),
  quote: new MasterWrapper(QuoteMaster),
  sampleList: new MasterWrapper(SampleListMaster),
  scoreSample: new MasterWrapper(ScoreSampleMaster),
  section: new MasterWrapper(SectionMaster),
  song: new MasterWrapper(SongMaster),
  task: new MasterWrapper(TaskMaster),
  video: new MasterWrapper(VideoMaster),
  wikipedia: new MasterWrapper(WikipediaMaster),
  youtube: new MasterWrapper(YoutubeMaster)
}
