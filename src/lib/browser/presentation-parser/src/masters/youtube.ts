import { Master } from '../master'
import { getConfig } from '@bldr/config'
import { get } from '@bldr/media-resolver-ng'

const config = getConfig()

export async function getSnippet (
  youtubeId: string
): Promise<YoutubeVideoSnippet | undefined> {
  const snippet = await get(
    'https://www.googleapis.com/youtube/v3/videos',
    {
      params: {
        part: 'snippet',
        id: youtubeId,
        key: config.youtube.apiKey
      }
    }
  )

  if (snippet.data.items.length > 0) {
    return snippet.data.items[0].snippet as YoutubeVideoSnippet
  }
}

export async function checkAvailability (youtubeId: string): Promise<boolean> {
  const snippet = await getSnippet(youtubeId)
  if (snippet != null) return true
  return false
}

// https://github.com/Tenpi/youtube.ts/blob/master/types/VideoTypes.ts

export interface YoutubeVideo {
  kind: string
  etag: string
  id: string
  snippet: YoutubeVideoSnippet
  contentDetails: YoutubeVideoContentDetails
  status: YoutubeVideoStatus
  statistics: YoutubeVideoStatistics
  player: {
    embedHtml: string
  }
}

export interface YoutubeVideoStatistics {
  viewCount: string
  likeCount: string
  dislikeCount: string
  favoriteCount: string
  commentCount: string
}

export interface YoutubeVideoStatus {
  uploadStatus: string
  privacyStatus: string
  license: string
  embeddable: boolean
  publicStatsViewable: boolean
}

export interface YoutubeVideoContentDetails {
  duration: string
  dimension: string
  definition: string
  caption: string
  licensedContent: boolean
  projection: string
}

export interface YoutubeVideoSnippet {
  publishedAt: string
  channelId: string
  title: string
  description: string
  thumbnails: {
    default: YoutubeThumbnail
    medium: YoutubeThumbnail
    high: YoutubeThumbnail
    standard?: YoutubeThumbnail
    maxres?: YoutubeThumbnail
  }
  channelTitle: string
  tags: string[]
  categoryId: string
  liveBroadcastContent: string
  defaultLanguage: string
  localized: {
    title: string
    description: string
    defaultAudioLanguage: string
  }
}

export interface YoutubeThumbnail {
  url: string
  width: number
  height: number
}

export interface YoutubeVideoParams {
  key?: string
  part?: string
  id?: string
  h1?: string
  maxHeight?: number
  maxResults?: number
  maxWidth?: number
  pageToken?: string
  regionCode?: string
  videoCategoryId?: string
}

export interface YoutubeDownloadOptions {
  quality?:
  | '144p'
  | '240p'
  | '270p'
  | '360p'
  | '480p'
  | '720p'
  | '720p60'
  | '1080p'
  | '1080p60'
  | '1440p'
  | '1440p60'
  | '2160p'
  | '2160p60'
  | '4320p'
  | '4320p60'
  format?: 'mp4' | 'flv' | '3gp' | 'webm' | 'ts'
}

export type YoutubeFieldsRaw = string | YoutubeFieldNormalized

interface YoutubeFieldNormalized {
  youtubeId: string
  heading?: string
  info?: string
}

export class YoutubeMaster implements Master {
  name = 'youtube'

  displayName = 'YouTube'

  icon = {
    name: 'youtube',
    color: 'red',

    /**
     * U+1F534
     *
     * @see https://emojipedia.org/large-red-circle/
     */
    unicodeSymbol: '🔴'
  }

  fieldsDefintion = {
    youtubeId: {
      type: String,
      required: true,
      description: 'Die Youtube-ID (z. B. xtKavZG1KiM).'
    },
    heading: {
      type: String,
      description: 'Eigene Überschrift',
      markup: true
    },
    info: {
      type: String,
      description: 'längerer Informations-Text',
      markup: true
    }
  }

  shortFormField = 'youtubeId'

  collectOptionalMediaUris (
    fields: YoutubeFieldNormalized
  ): string {
    return this.convertYoutubeIdToUri(fields.youtubeId)
  }

  private convertYoutubeIdToUri (youtubeId: string): string {
    return `ref:YT_${youtubeId}`
  }
}
