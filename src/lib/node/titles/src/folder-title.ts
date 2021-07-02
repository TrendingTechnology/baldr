import config from '@bldr/config'

import type { TitlesTypes } from '@bldr/type-definitions'

export class FolderTitle implements TitlesTypes.FolderTitle {
  title: string
  subtitle?: string
  folderName: string
  relPath: string
  hasPraesentation: boolean
  level?: number

  /**
   * @param data - Some meta data about the folder.
   */
  constructor ({ title, subtitle, folderName, relPath, hasPraesentation, level }: TitlesTypes.FolderTitleSpec) {
    this.title = title
    if (subtitle != null) {
      this.subtitle = subtitle
    }
    this.folderName = folderName
    relPath = relPath.replace(config.mediaServer.basePath, '')
    relPath = relPath.replace(/^\//, '')
    this.relPath = relPath
    this.hasPraesentation = hasPraesentation
    this.level = level
  }
}
