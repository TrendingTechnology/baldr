import type { MediaCategory, AssetType } from '@bldr/type-definitions'

import path from 'path'

import { validateYoutubeId } from '../main'

interface YoutubeIntermediate extends AssetType.Intermediate {
  youtubeId: string
}

interface YoutubeCategory extends MediaCategory.Category {
  abbreviation: string
}

/**
 * The meta data type specification “youtube”.
 */
export const youtube: MediaCategory.Category = {
  title: 'YouTube-Video',
  abbreviation: 'YT',
  detectCategoryByPath: function () {
    return new RegExp('^.*/YT/.*.mp4$')
  },
  relPath ({ data, oldRelPath }) {
    const youtubeData = data as YoutubeIntermediate
    const oldRelDir = path.dirname(oldRelPath)
    return path.join(oldRelDir, `${youtubeData.youtubeId}.mp4`)
  },
  props: {
    id: {
      title: 'ID eines YouTube-Videos',
      derive: function ({ data, category }) {
        const youtubeCategory = category as YoutubeCategory
        const youtubeData = data as YoutubeIntermediate
        return `${youtubeCategory.abbreviation}_${youtubeData.youtubeId}`
      },
      overwriteByDerived: true
    },
    title: {
      title: 'Titel eines YouTube-Videos',
      derive: function ({ data }) {
        let title: string
        if (data.heading != null && data.heading !== '') {
          title = data.heading
        } else if (data.originalHeading != null && data.originalHeading !== '') {
          title = data.originalHeading
        } else {
          title = data.youtubeId
        }
        return `YouTube-Video „${title}“`
      },
      overwriteByDerived: true
    },
    youtubeId: {
      title: 'Die ID eines YouTube-Videos (z. B. gZ_kez7WVUU)',
      validate: validateYoutubeId
    },
    heading: {
      title: 'Eigene Überschrift'
    },
    info: {
      title: 'Eigener längerer Informationstext'
    },
    original_heading: {
      title: 'Die orignale Überschrift des YouTube-Videos'
    },
    original_info: {
      title: 'Der orignale Informationstext des YouTube-Videos'
    }
  }
}
