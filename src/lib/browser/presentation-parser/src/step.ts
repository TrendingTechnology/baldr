/**
 * A slide can have several steps. A step is comparable to the animations of
 * Powerpoint or LibreOffice Impress.
 */
export interface Step {
  /**
   * The first step number is one.
   */
  no: string

  title: string
  shortcut?: string
}
