import { ApiTypes } from '@bldr/type-definitions';
export declare function updateMediaServer(): Promise<ApiTypes.UpdateResult>;
export declare function getStatsCount(): Promise<ApiTypes.Count>;
export declare function getStatsUpdates(): Promise<ApiTypes.Task[]>;
export declare function getAssetByUri(uri: string, throwException?: boolean): Promise<any | undefined>;
