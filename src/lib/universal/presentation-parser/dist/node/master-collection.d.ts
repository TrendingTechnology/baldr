import { Master } from './master-wrapper';
export declare const masterCollection: {
    [masterName: string]: Master;
};
export declare function getMaster(masterName: string): Master;
