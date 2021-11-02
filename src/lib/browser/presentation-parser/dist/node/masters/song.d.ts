import { Master } from '../master';
export declare class SongMaster extends Master {
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
}
