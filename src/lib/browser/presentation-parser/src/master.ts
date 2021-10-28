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

/**
 * Some data indexed by strings
 */
export interface FieldData {
  [fieldName: string]: any
}

/**
 * We name the properties of a master slide “field” to better distinguish them
 * from the Vue properties “props”.
 * It is an extended version of the Vue `props` defintion.
 *
 * ```js
 *  const fields = {
 *    src: {
 *      default: 'ref:Fuer-Elise'
 *      description: 'Den URI zu einer Video-Datei.',
 *      inlineMarkup: false
 *      markup: false
 *      assetUri: true,
 *      required: true,
 *      type: String,
 *    }
 *  }
 * ```
 */
interface FieldDefinition {
  /**
   * A default value.
   */
  default?: any

  /**
   * Text to describe the property. A descriptive text shown in the
   * documentation.
   */
  description?: string

  /**
   * Indicates that this `prop` is text for extracting inline media URIs
   * like `[id:Beethoven_Ludwig-van]`.
   */
  inlineMarkup?: boolean

  /**
   * The specified value can contain markup. The value can be written in
   * Markdown and or in HTML. Markdown is converted into HTML. The key
   * `type` has to be `String`.
   */
  markup?: boolean

  /**
   * Indicates that this `prop` contains a media file URI.
   */
  assetUri?: boolean

  /**
   * Must be specifed.
   */
  required?: boolean

  /**
   * The same as Vue `type`.
   */
  type?: object
}

export abstract class Master {
  /**
   * The name of the master slide. A short name in lower case letters like `audio`.
   */
  abstract name: string

  /**
   * A human readable name of the master slide.
   */
  abstract displayName: string

  /**
   * The defintion of the fields of the master slide.
   */
  abstract fieldsDefintion?: {
    [key: string]: FieldDefinition
  }

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
  normalizeFields? (fields: any): FieldData {
    return fields
  }
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
  scoreSample: new ScoreSampleMaster(),
  section: new SectionMaster(),
  song: new SongMaster(),
  task: new TaskMaster(),
  video: new VideoMaster(),
  wikipedia: new WikipediaMaster(),
  youtube: new YoutubeMaster()
}
