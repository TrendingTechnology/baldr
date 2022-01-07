import { MasterSpec } from '../master-specification';
import { Asset } from '@bldr/media-resolver';
export declare function convertYoutubeIdToUri(youtubeId: string): string;
/**
 * https://stackoverflow.com/a/55890696/10193818
 *
 * Low quality
 * https://img.youtube.com/vi/[video-id]/sddefault.jpg
 *
 * medium quality
 * https://img.youtube.com/vi/[video-id]/mqdefault.jpg
 *
 * High quality
 * http://img.youtube.com/vi/[video-id]/hqdefault.jpg
 *
 * maximum resolution
 * http://img.youtube.com/vi/[video-id]/maxresdefault.jpg
 */
export declare function findPreviewHttpUrl(youtubeId: string, asset?: Asset): string | undefined;
export declare function getSnippet(youtubeId: string): Promise<YoutubeVideoSnippet | undefined>;
export declare function checkAvailability(youtubeId: string): Promise<boolean>;
export interface YoutubeVideo {
    kind: string;
    etag: string;
    id: string;
    snippet: YoutubeVideoSnippet;
    contentDetails: YoutubeVideoContentDetails;
    status: YoutubeVideoStatus;
    statistics: YoutubeVideoStatistics;
    player: {
        embedHtml: string;
    };
}
export interface YoutubeVideoStatistics {
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    favoriteCount: string;
    commentCount: string;
}
export interface YoutubeVideoStatus {
    uploadStatus: string;
    privacyStatus: string;
    license: string;
    embeddable: boolean;
    publicStatsViewable: boolean;
}
export interface YoutubeVideoContentDetails {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    projection: string;
}
export interface YoutubeVideoSnippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
        default: YoutubeThumbnail;
        medium: YoutubeThumbnail;
        high: YoutubeThumbnail;
        standard?: YoutubeThumbnail;
        maxres?: YoutubeThumbnail;
    };
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    defaultLanguage: string;
    localized: {
        title: string;
        description: string;
        defaultAudioLanguage: string;
    };
}
export interface YoutubeThumbnail {
    url: string;
    width: number;
    height: number;
}
export interface YoutubeVideoParams {
    key?: string;
    part?: string;
    id?: string;
    h1?: string;
    maxHeight?: number;
    maxResults?: number;
    maxWidth?: number;
    pageToken?: string;
    regionCode?: string;
    videoCategoryId?: string;
}
export interface YoutubeDownloadOptions {
    quality?: '144p' | '240p' | '270p' | '360p' | '480p' | '720p' | '720p60' | '1080p' | '1080p60' | '1440p' | '1440p60' | '2160p' | '2160p60' | '4320p' | '4320p60';
    format?: 'mp4' | 'flv' | '3gp' | 'webm' | 'ts';
}
export declare type YoutubeFieldsRaw = string | YoutubeFieldNormalized;
interface YoutubeFieldNormalized {
    youtubeId: string;
    heading?: string;
    info?: string;
}
export declare class YoutubeMaster implements MasterSpec {
    name: string;
    displayName: string;
    icon: {
        name: string;
        color: string;
        /**
         * U+1F534
         *
         * @see https://emojipedia.org/large-red-circle/
         */
        unicodeSymbol: string;
    };
    fieldsDefintion: {
        youtubeId: {
            type: StringConstructor;
            required: boolean;
            description: string;
        };
        heading: {
            type: StringConstructor;
            description: string;
            markup: boolean;
        };
        info: {
            type: StringConstructor;
            description: string;
            markup: boolean;
        };
    };
    shortFormField: string;
    collectOptionalMediaUris(fields: YoutubeFieldNormalized): string;
}
export {};
