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
import { WebsiteMaster } from './masters/website'
import { WikipediaMaster } from './masters/wikipedia'
import { YoutubeMaster } from './masters/youtube'

import { Master } from './master-wrapper'

export const masterCollection: { [masterName: string]: Master } = {
  audio: new Master(AudioMaster),
  camera: new Master(CameraMaster),
  cloze: new Master(ClozeMaster),
  counter: new Master(CounterMaster),
  document: new Master(DocumentMaster),
  editor: new Master(EditorMaster),
  generic: new Master(GenericMaster),
  group: new Master(GroupMaster),
  image: new Master(ImageMaster),
  instrument: new Master(InstrumentMaster),
  interactiveGraphic: new Master(InteractiveGraphicMaster),
  note: new Master(NoteMaster),
  person: new Master(PersonMaster),
  question: new Master(QuestionMaster),
  quote: new Master(QuoteMaster),
  sampleList: new Master(SampleListMaster),
  scoreSample: new Master(ScoreSampleMaster),
  section: new Master(SectionMaster),
  song: new Master(SongMaster),
  task: new Master(TaskMaster),
  video: new Master(VideoMaster),
  website: new Master(WebsiteMaster),
  wikipedia: new Master(WikipediaMaster),
  youtube: new Master(YoutubeMaster)
}

export function getMaster (masterName: string): Master {
  if (masterCollection[masterName] == null) {
    throw new Error(`Unknown master “${masterName}”`)
  }
  return masterCollection[masterName]
}
