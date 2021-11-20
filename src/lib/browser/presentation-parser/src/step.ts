type StepSpecificationRaw = string | StepSpecification

interface StepSpecification {
  title: string
  shortcut?: string
}

/**
 * A slide can have several steps. A step is comparable to the animations of
 * Powerpoint or LibreOffice Impress.
 */
export interface Step extends StepSpecification {
  /**
   * The first step number is one.
   */
  no: number
}

export class StepCollector {
  public steps: Step[]

  constructor () {
    this.steps = []
  }

  add (spec: StepSpecificationRaw): void {
    const no = this.steps.length + 1
    if (typeof spec === 'string') {
      this.steps.push({ no, title: spec })
    } else {
      this.steps.push(Object.assign({ no }, spec))
    }
  }
}
