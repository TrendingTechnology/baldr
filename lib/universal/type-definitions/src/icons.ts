export interface IconDefintion {
  /**
   * Name of the icon on the website https://materialdesignicons.com
   */
  materialName?: string

  /**
   * File name inside the directory
   * `config.iconFont.additionalIconsPath`
   */
  fileName?: string

  description?: string

  group?: string
}

export interface IconFontMapping {
  [newName: string]: IconDefintion
}

export interface IconFontConfiguration {
  /**
   * A HTTP URL with the string `{icon}` in it. The raw Github URL of the
   * Material Design Icons Github project.
   *
   * `"https://raw.github...svg/{icon}.svg"`
   */
  urlTemplate: string

  /**
   * A path of a directory containing some additional SVG file for some
   * extra icons in the destination icon font. To be able to extend
   * the Matertial Design icons.
   */
  additionalIconsPath: string

  /**
   * Destination path of the generated files for distribution.
   */
  destPath: string

  /**
   * This property is filled in by the font generator.
   */
  unicodeAssignment: {
    /**
     * `account-group: 59905`
     */
    [newName: string]: number
  }

  iconMapping: IconFontMapping
}
