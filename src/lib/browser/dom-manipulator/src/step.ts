export type HTMLSVGElement = SVGElement | HTMLElement

/**
 * A wrapper class for a HTML element to be able to hide and show easily some
 * HTML elements.
 */
export class Step {
  htmlElements: HTMLSVGElement[]
  private readonly useVisiblilty: boolean

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

  public setState (isVisible: boolean): void {
    for (const element of this.htmlElements) {
      if (isVisible) {
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
    this.setState(true)
  }

  public hide (): void {
    this.setState(false)
  }
}
