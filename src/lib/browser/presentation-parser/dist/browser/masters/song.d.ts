import { Master } from '../master';
declare type SongFieldsRaw = string | SongFieldsNormalized;
interface SongFieldsNormalized {
    songId: string;
}
export declare class SongMaster implements Master {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
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
