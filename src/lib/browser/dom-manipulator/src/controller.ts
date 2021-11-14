import { buildSubsetIndexes } from '@bldr/core-browser'

import { Step, HTMLSVGElement } from './step'

/**
 * Generate steps by hiding and showing some DOM elements.
 */
export class Controller {
  /**
   * All elements
   */
  steps: Step[]

  subsetIndexes?: number[]

  constructor (steps: Step[], subsetSpecifier?: string) {
    this.steps = steps
    if (subsetSpecifier != null) {
      this.subsetIndexes = buildSubsetIndexes(
        subsetSpecifier,
        this.steps.length + 1,
        -2
      )
    }
  }

  /**
   * The number of steps
   */
  public get count (): number {
    if (this.subsetIndexes != null) {
      return this.subsetIndexes.length + 1
    }
    return this.steps.length + 1
  }

  private get subsetBeginIndex (): number {
    if (this.subsetIndexes != null) {
      return this.subsetIndexes[0]
    }
    return 0
  }

  /**
   * Hide all elements.
   */
  hideAll (): void {
    for (const step of this.steps) {
      step.hide()
    }
  }

  public hideFromSubsetBegin (): void {
    for (let index = 0; index < this.subsetBeginIndex; index++) {
      this.steps[index].show()
    }
    for (let index = this.subsetBeginIndex; index < this.steps.length; index++) {
      this.steps[index].hide()
    }
  }

  private getStep (indexFromZero: number): Step {
    let index = indexFromZero
    if (this.subsetIndexes != null) {
      index = this.subsetIndexes[index]
    }
    return this.steps[index]
  }

  /**
   * Set the display / visiblilty state on HTML elements. On the first step no
   * elements are displayed. The number of steps is: number of elements + 1.
   *
   * @param stepNumber - A consecutive number from 1 (all step elements are
   *   hidden) to step element count + 1.
   *
   * @returns The element that is displayed by the new step number.
   */
  public showUpTo (stepNumber: number): HTMLSVGElement | undefined {
    let currentElement: HTMLSVGElement | undefined
    for (let index = 0; index < this.count - 1; index++) {
      const step = this.getStep(index)
      step.setState(stepNumber > index + 1)
      if (stepNumber === index + 2) {
        currentElement = step.htmlElement
      }
    }
    return currentElement
  }
}
