import { Builder, MediaData } from './builder'

interface PresentationData extends MediaData {}

/**
 * The whole presentation YAML file converted to an Javascript object. All
 * properties are in `camelCase`.
 */
export class PresentationBuilder extends Builder {
  data: PresentationData
  // meta?: LampTypes.PresentationMeta

  /**
   * The plain text version of `this.meta.title`.
   */
  // title: string

  /**
   * The plain text version of `this.meta.title (this.meta.subtitle)`
   */
  // titleSubtitle: string

  /**
   * The plain text version of `folderTitles.allTitles
   * (this.meta.subtitle)`
   *
   * For example:
   *
   * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
   * Johann Sebastian Bach: Musik als Bekenntnis /
   * Johann Sebastian Bachs Reise nach Berlin 1747 (Ricercar a 3)
   */
  // allTitlesSubtitle: string

  /**
   * Value is the same as `meta.ref`
   */
  // ref: string

  constructor (filePath: string) {
    super(filePath)

    this.data = {
      relPath: this.relPath
    }
    // const data = readYamlFile(filePath)
    // if (data != null) this.importProperties(data)

    // const deepTitle = titleTreeFactory.addTitleByPath(filePath)

    // if (this.meta == null) {
    //   // eslint-disable-next-line
    //   this.meta = {} as LampTypes.PresentationMeta
    // }

    // if (this.meta?.ref == null) {
    //   this.meta.ref = deepTitle.ref
    // }
    // if (this.meta?.title == null) {
    //   this.meta.title = deepTitle.title
    // }
    // if (this.meta?.subtitle == null) {
    //   this.meta.subtitle = deepTitle.subtitle
    // }
    // if (this.meta?.curriculum == null) {
    //   this.meta.curriculum = deepTitle.curriculum
    // }
    // if (this.meta?.grade == null) {
    //   this.meta.grade = deepTitle.grade
    // }
    // this.title = stripTags(this.meta.title)
    // this.titleSubtitle = this.titleSubtitle_()
    // this.allTitlesSubtitle = this.allTitlesSubtitle_(deepTitle)
    // this.ref = this.meta.ref
  }

  // /**
  //  * Generate the plain text version of `this.meta.title (this.meta.subtitle)`
  //  */
  // private titleSubtitle_ (): string {
  //   if (this.meta?.subtitle != null) {
  //     return `${this.title} (${stripTags(this.meta.subtitle)})`
  //   } else {
  //     return this.title
  //   }
  // }

  // /**
  //  * Generate the plain text version of `folderTitles.allTitles
  //  * (this.meta.subtitle)`
  //  *
  //  * For example:
  //  *
  //  * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
  //  * Johann Sebastian Bach: Musik als Bekenntnis /
  //  * Johann Sebastian Bachs Reise nach Berlin 1747 (Ricercar a 3)
  //  */
  // private allTitlesSubtitle_ (folderTitles: DeepTitle): string {
  //   let all = folderTitles.allTitles
  //   if (this.meta?.subtitle != null) {
  //     all = `${all} (${this.meta.subtitle})`
  //   }
  //   return stripTags(all)
  // }

  public buildAll () {
    return this
  }

  public export () {
    return this.data
  }
}
