import { buildSubsetIndexes } from '@bldr/core-browser'

import { StepElement } from './step'

/**
 * Generate steps by hiding and showing some DOM elements.
 */
export class StepController {
  /**
   * All step elements. One element less than the total number of steps.
   */
  public steps: StepElement[]

  /**
   * The array indexes of the specified step subset.
   *
   * Example:
   *
   * ```md
   * 1 2 3 4 5 (Step numbers)
   *   0 1 2 3 (indexes of this.steps)
   *     1 2   (values of this.subsetIndexes of subset specifier '3-4')
   * ```
   */
  subsetIndexes?: number[]

  constructor (steps: StepElement[], subsetSpecifier?: string) {
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
   * The number of steps is one greater then the number of step objects.
   */
  public get stepCount (): number {
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
  public hideAll (): void {
    for (const step of this.steps) {
      step.hide()
    }
  }

  public hideFromSubsetBegin (): void {
    for (let index = 0; index < this.subsetBeginIndex; index++) {
      this.steps[index].show()
    }
    for (
      let index = this.subsetBeginIndex;
      index < this.steps.length;
      index++
    ) {
      this.steps[index].hide()
    }
  }

  private getStep (indexFromZero: number): StepElement {
    let index = indexFromZero
    if (this.subsetIndexes != null) {
      index = this.subsetIndexes[index]
    }
    return this.steps[index]
  }

  /**
   * Show all elements up to and including the element with the number
   * `stepNummer`. The number of steps is: number of elements + 1.
   *
   * @param stepNumber - A consecutive number from 1 (all step elements are
   *   hidden) to step element count + 1.
   *
   * @returns The element that is displayed by the new step number.
   */
  public showUpTo (stepNumber: number): StepElement | undefined {
    let currentStep: StepElement | undefined
    for (let index = 0; index < this.stepCount - 1; index++) {
      const step = this.getStep(index)
      step.setVisibilityStatus(stepNumber > index + 1)
      if (stepNumber === index + 2) {
        currentStep = step
      }
    }
    return currentStep
  }
}
