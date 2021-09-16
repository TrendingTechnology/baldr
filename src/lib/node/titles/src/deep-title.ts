import fs from 'fs'
import path from 'path'

import { LampTypes, TitlesTypes } from '@bldr/type-definitions'

import { FolderTitle } from './folder-title'

export class DeepTitle implements TitlesTypes.DeepTitle {
  /**
   * An array of folder titles. The last element is the folder title of
   * the `filePath`.
   */
  private readonly titles: FolderTitle[]

  /**
   * An array of folder names. This array is used to descent the folder tree.
   */
  private readonly folderNames: string[]

  /**
   * @param filePath - The path of a file in a folder with `title.txt`
   *   files.
   */
  constructor (filePath: string) {
    this.titles = []
    this.read(filePath)
    this.folderNames = this.titles.map(folderTitle => folderTitle.folderName)
  }

  shiftFolderName (): string | undefined {
    return this.folderNames.shift()
  }

  /**
   * Parse the `title.txt` text file. The first line of this file contains
   * the title, the second lines contains the subtitle.
   *
   * @param filePath - The absolute path of a `title.txt` file.
   */
  private readTitleTxt (filePath: string): FolderTitle {
    const titleRaw = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const titles = titleRaw.split('\n')

    let title: string | undefined
    if (titles.length === 0) {
      throw new Error(`${filePath} is empty and has no title.`)
    }
    if (titles.length > 0) {
      title = titles[0]
    }
    if (title == null) {
      throw new Error(`No title found in title.txt ${filePath}.`)
    }

    let subtitle: string | undefined
    if (titles.length > 1 && titles[1] != null && titles[1] !== '') {
      subtitle = titles[1]
    }

    let hasPresentation: boolean = false
    if (
      fs.existsSync(
        path.join(path.dirname(filePath), 'Praesentation.baldr.yml')
      )
    ) {
      hasPresentation = true
    }

    const relPath = path.dirname(filePath)
    const folderName = path.basename(relPath)
    return new FolderTitle({
      title,
      subtitle,
      hasPresentation,
      relPath,
      folderName
    })
  }

  /**
   * Generate the path of the title.txt file `/var/data/baldr/media/05/title.txt`
   *
   * @param pathSegments An array of path segments `['', 'var', 'data', 'baldr',
   *   'media', '05']` without the filename `title.txt` itself.
   *
   * @returns The path of a title.txt file
   */
  private generateTitleTxtPath (pathSegments: string[]): string {
    return [...pathSegments, 'title.txt'].join(path.sep)
  }

  /**
   * Find all title.txt files (from the deepest to the shallowest title.txt)
   *
   * @param filePath A file path from which to descend into the folder
   *   structure.
   *
   * @returns An array with absolute file paths. First the deepest title.txt
   *   file. Last the shallowest title.txt file.
   */
  private findTitleTxt (filePath: string): string[] {
    let parentDir: string
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
      parentDir = filePath
    } else {
      parentDir = path.dirname(filePath)
    }
    const segments = parentDir.split(path.sep)
    const titlePaths: string[] = []
    let found = false
    for (let index = segments.length; index >= 0; index--) {
      const pathSegments = segments.slice(0, index)
      // /media/05/20_Mensch-Zeit/10_Mozart/20_Biographie-Salzburg-Wien/title.txt
      // /media/05/20_Mensch-Zeit/10_Mozart/title.txt
      // /media/05/20_Mensch-Zeit/title.txt
      // /media/05/title.txt
      const titleTxt = this.generateTitleTxtPath(pathSegments)
      if (fs.existsSync(titleTxt)) {
        found = true
        // Do not push “title.txt” in the parent working directory (without initial /).
        // Push only absolute paths
        if (titleTxt.indexOf(path.sep) === 0) {
          titlePaths.push(titleTxt)
        }
      } else if (found) {
        break
      }
    }
    return titlePaths.reverse()
  }

  /**
   * Read all `title.txt` files. Descend to all parent folders which contain
   * a `title.txt` file.
   *
   * @param filePath - The path of the presentation file.
   */
  private read (filePath: string): void {
    // We need absolute paths. The cli gives us relative paths.
    filePath = path.resolve(filePath)
    const titleTxtPaths = this.findTitleTxt(filePath)
    let level: number = 1
    for (const titleTxtPath of titleTxtPaths) {
      const folderTitle = this.readTitleTxt(titleTxtPath)
      folderTitle.level = level++
      this.titles.push(folderTitle)
    }
  }

  /**
   * Get an array of title strings.
   */
  private get titlesArray (): string[] {
    return this.titles.map(folderTitle => folderTitle.title)
  }

  /**
   * Get the last instance of the class FolderTitle
   */
  private get lastFolderTitleObject (): FolderTitle {
    return this.titles[this.titles.length - 1]
  }

  get allTitles (): string {
    return this.titlesArray.join(' / ')
  }

  get curriculumTitlesArray (): string[] {
    return this.titlesArray.slice(1, this.titles.length - 1)
  }

  get curriculum (): string {
    return this.curriculumTitlesArray.join(' / ')
  }

  get curriculumTitlesArrayFromGrade (): string[] {
    return this.titlesArray.slice(
      this.gradeIndexPosition + 1,
      this.titles.length - 1
    )
  }

  get curriculumFromGrade (): string {
    return this.curriculumTitlesArrayFromGrade.join(' / ')
  }

  get ref (): string {
    return this.lastFolderTitleObject.folderName.replace(/\d\d_/, '')
  }

  get title (): string {
    return this.lastFolderTitleObject.title
  }

  get subtitle (): string | undefined {
    if (this.lastFolderTitleObject.subtitle != null) {
      return this.lastFolderTitleObject.subtitle
    }
  }

  get titleAndSubtitle (): string {
    if (this.subtitle != null) return `${this.title} - ${this.subtitle}`
    return this.title
  }

  /**
   * Get the index number of the folder title object containing “X. Jahrgangsstufe”.
   */
  private get gradeIndexPosition (): number {
    let i = 0
    for (const folderTitle of this.titles) {
      if (folderTitle.title.match(/^\d+\. *Jahrgangsstufe$/) != null) {
        return i
      }
      i++
    }
    throw new Error(
      `“X. Jahrgangsstufe” not found in the titles: ${this.allTitles}`
    )
  }

  get grade (): number {
    return parseInt(
      this.titles[this.gradeIndexPosition].title.replace(/[^\d]+$/, '')
    )
  }

  list (): FolderTitle[] {
    return this.titles
  }

  getFolderTitleByFolderName (folderName: string): FolderTitle | undefined {
    for (const folderTitle of this.titles) {
      if (folderTitle.folderName === folderName) {
        return folderTitle
      }
    }
  }

  generatePresetationMeta (): LampTypes.PresentationMeta {
    const result: LampTypes.PresentationMeta = {
      ref: this.ref,
      subtitle: this.subtitle,
      title: this.title,
      grade: this.grade,
      curriculum: this.curriculum
    }
    if (result.subtitle == null || result.subtitle === '') {
      delete result.subtitle
    }
    return result
  }
}
