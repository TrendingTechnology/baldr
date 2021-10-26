import { AudioMaster } from './audio';
import { CameraMaster } from './camera';
import { ClozeMaster } from './cloze';
import { CounterMaster } from './counter';
import { DocumentMaster } from './document';
import { EditorMaster } from './editor';
import { GenericMaster } from './generic';
import { GroupMaster } from './group';
import { ImageMaster } from './image';
import { InstrumentMaster } from './instrument';
import { InteractiveGraphicMaster } from './interactive-graphic';
import { NoteMaster } from './note';
import { PersonMaster } from './person';
import { QuestionMaster } from './question';
import { QuoteMaster } from './quote';
import { SampleListMaster } from './sample-list';
import { ScoreMaster } from './score';
import { SectionMaster } from './section';
import { SongMaster } from './song';
import { TaskMaster } from './task';
import { VideoMaster } from './video';
import { WikipediaMaster } from './wikipedia';
import { YoutubeMaster } from './youtube';
export declare abstract class Master {
    /**
     * The name of the master slide. A short name in lower case letters like `audio`.
     */
    abstract name: string;
    /**
     * A human readable name of the master slide.
     */
    abstract displayName: string;
}
export declare const masterCollection: {
    audio: AudioMaster;
    camera: CameraMaster;
    cloze: ClozeMaster;
    counter: CounterMaster;
    document: DocumentMaster;
    editor: EditorMaster;
    generic: GenericMaster;
    group: GroupMaster;
    image: ImageMaster;
    instrument: InstrumentMaster;
    interactiveGraphic: InteractiveGraphicMaster;
    note: NoteMaster;
    person: PersonMaster;
    question: QuestionMaster;
    quote: QuoteMaster;
    sampleList: SampleListMaster;
    score: ScoreMaster;
    section: SectionMaster;
    song: SongMaster;
    task: TaskMaster;
    video: VideoMaster;
    wikipedia: WikipediaMaster;
    youtube: YoutubeMaster;
};
