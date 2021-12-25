import { ApiTypes, TitlesTypes } from '@bldr/type-definitions';
export declare function updateMediaServer(): Promise<ApiTypes.MediaUpdateResult>;
export declare function getMediaStatistics(): Promise<ApiTypes.MediaStatistics>;
export declare function getPresentationByRef(ref: string): Promise<any | undefined>;
export declare function getPresentationAsStringByPath(relPath: string): Promise<string>;
export declare function getAssetByUri(uri: string, throwException?: boolean): Promise<any | undefined>;
export declare function getTitleTree(): Promise<TitlesTypes.TreeTitleList>;
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
export {};
