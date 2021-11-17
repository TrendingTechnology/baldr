export type HTMLSVGElement = SVGElement | HTMLElement

/**
 * A wrapper class around a HTML or a SVG element to be able to hide and show
 * this element very easily.
 */
export class StepElement {
  /**
   * For example the master slide `question` uses `display = 'none'` to
   * hide the answers.
   */
  private readonly useVisiblilty: boolean
  htmlElements: HTMLSVGElement[]

  isVisible: boolean = true

  public onShow?: () => void
  public onHide?: () => void

  /**
   * @property Multiple HTML elements as an array or a
   *   single HTML element.
   * @property useVisibliltyStyleProperty - Set the visibility
   *   `element.style.visibility` instead of the display state.
   */
  constructor (
    elements: HTMLSVGElement[] | HTMLSVGElement,
    useVisibliltyStyleProperty: boolean = true
  ) {
    if (Array.isArray(elements)) {
      this.htmlElements = elements
    } else {
      this.htmlElements = [elements]
    }
    this.useVisiblilty = useVisibliltyStyleProperty
  }

  private executeOnShowEvent (): void {
    if (this.onShow != null) {
      this.onShow()
    }
  }

  private executeOnHideEvent (): void {
    if (this.onHide != null) {
      this.onHide()
    }
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

    if (show) {
      this.executeOnShowEvent()
    } else {
      this.executeOnHideEvent()
    }

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
