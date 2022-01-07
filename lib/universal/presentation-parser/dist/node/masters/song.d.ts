import { MasterSpec } from '../master-specification';
declare type SongFieldsRaw = string | SongFieldsNormalized;
interface SongFieldsNormalized {
    songId: string;
}
export declare class SongMaster implements MasterSpec {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+1F3BC
         *
         * @see https://emojipedia.org/musical-score/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        songId: {
            type: StringConstructor;
            description: string;
        };
    };
    normalizeFieldsInput(fields: SongFieldsRaw): SongFieldsNormalized;
    collectMediaUris(fields: SongFieldsNormalized): string;
    private convertSongIdToRef;
}
export {};
