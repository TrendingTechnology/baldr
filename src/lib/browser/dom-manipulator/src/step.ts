export type HTMLSVGElement = SVGElement | HTMLElement

/**
 * A wrapper class around a HTML or a SVG element to be able to hide and show
 * this element very easily.
 */
export class StepElement {
  htmlElements: HTMLSVGElement[]
  private readonly useVisiblilty: boolean

  isVisible: boolean = true

  /**
   * @property Multiple HTML elements as an array or a
   *   single HTML element.
   * @property useVisiblilty - Set the visibility
   *   `element.style.visibility` instead of the display state.
   */
  constructor (
    elements: HTMLSVGElement[] | HTMLSVGElement,
    useVisiblilty: boolean = false
  ) {
    if (Array.isArray(elements)) {
      this.htmlElements = elements
    } else {
      this.htmlElements = [elements]
    }

    this.useVisiblilty = useVisiblilty
  }

  /**
   * The last HTML element.
   */
  get htmlElement (): HTMLSVGElement {
    return this.htmlElements[this.htmlElements.length - 1]
  }

  get text (): string | undefined {
    if (this.htmlElement.textContent != null) {
      return this.htmlElement.textContent
    }
  }

  public setVisibilityStatus (show: boolean): void {
    if (this.isVisible === show) {
      return
    }
    this.isVisible = show
    for (const element of this.htmlElements) {
      if (show) {
        if (this.useVisiblilty) {
          element.style.visibility = 'visible'
        } else {
          element.style.display = 'block'
        }
      } else {
        if (this.useVisiblilty) {
          element.style.visibility = 'hidden'
        } else {
          element.style.display = 'none'
        }
      }
    }
  }

  public show (): void {
    this.setVisibilityStatus(true)
  }

  public hide (): void {
    this.setVisibilityStatus(false)
  }
}
