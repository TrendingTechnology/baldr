import { MasterWrapper } from './master';
export declare const masterCollection: {
    [masterName: string]: MasterWrapper;
};
export declare function getMaster(masterName: string): MasterWrapper;
