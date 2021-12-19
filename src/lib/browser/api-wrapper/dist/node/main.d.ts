import { ApiTypes } from '@bldr/type-definitions';
export declare function updateMediaServer(): Promise<ApiTypes.UpdateResult>;
export declare function getStatsCount(): Promise<ApiTypes.Count>;
export declare function getStatsUpdates(): Promise<ApiTypes.Task[]>;
export declare function getAssetByUri(uri: string, throwException?: boolean): Promise<any | undefined>;
interface OpenEditorParameters {
    ref: string;
    type?: 'presentation' | 'asset';
    dryRun?: boolean;
}
export declare function openEditor(params: OpenEditorParameters): Promise<any>;
interface OpenFileManagerParameters {
    ref: string;
    type?: 'presentation' | 'asset';
    create?: boolean;
    archive?: boolean;
    dryRun?: boolean;
}
export declare function openFileManager(params: OpenFileManagerParameters): Promise<any>;
declare const _default: {
    media: {
        open: {
            editor: typeof openEditor;
            fileManager: typeof openFileManager;
        };
    };
};
export default _default;
