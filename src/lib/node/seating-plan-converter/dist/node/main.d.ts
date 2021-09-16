/**
 * @module @bldr/seating-plan-converter
 */
declare const documentTemplate: {
    grades: {};
    jobs: {
        Schaltwart: {
            icon: string;
        };
        Austeilwart: {
            icon: string;
        };
        Klassenbuchführer: {
            icon: string;
        };
        Klassensprecher: {
            icon: string;
        };
        Lüftwart: {
            icon: string;
        };
    };
    timeStampMsec: number;
    meta: {
        location: string;
        teacher: string;
        year: string;
    };
};
export declare function convertNotenmanagerMdbToJson(mdbFile: string): Promise<typeof documentTemplate>;
export {};
