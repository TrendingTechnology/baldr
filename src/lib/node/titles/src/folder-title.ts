import { getConfig } from '@bldr/config-ng'

import type { TitlesTypes } from '@bldr/type-definitions'

const config = getConfig()

export class FolderTitle implements TitlesTypes.FolderTitle {
  title: string
  subtitle?: string
  folderName: string
  relPath: string
  hasPresentation: boolean
  level?: number

  /**
   * @param data - Some meta data about the folder.
   */
  constructor ({ title, subtitle, folderName, relPath, hasPresentation, level }: TitlesTypes.FolderTitleSpec) {
    this.title = title
    if (subtitle != null) {
      this.subtitle = subtitle
    }
    this.folderName = folderName
    relPath = relPath.replace(config.mediaServer.basePath, '')
    relPath = relPath.replace(/^\//, '')
    this.relPath = relPath
    this.hasPresentation = hasPresentation
    this.level = level
  }
}
