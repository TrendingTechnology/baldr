import { deepCopy, convertToString } from '@bldr/core-browser'

/**
 * A container class to store a deep copy of an object. This class can be
 * used to detect unexpected properties in an object.
 */
export class DataCutter {
  /**
   * The raw data object.
   */
  public raw: any

  constructor (rawData: object) {
    this.raw = deepCopy(rawData)
  }

  public get keys (): string[] {
    return Object.keys(this.raw)
  }

  /**
   * @throws {Error} If the value under the stored property name is not a string.
   */
  private checkString (propertyName: string): void {
    if (typeof this.raw[propertyName] !== 'string') {
      throw new Error(
        `The value of the property “${propertyName}” is not a string: ${convertToString(
          this.raw[propertyName]
        )}.`
      )
    }
  }

  /**
   * @throws {Error} If the value under the stored property name is not a number.
   */
  private checkNumber (propertyName: string): void {
    if (typeof this.raw[propertyName] !== 'number') {
      throw new Error(
        `The value of the property “${propertyName}” is not a number: ${convertToString(
          this.raw[propertyName]
        )}.`
      )
    }
  }

  /**
   * @throws {Error} If the value under the stored property name is null.
   */
  private checkNull (propertyName: string): void {
    if (this.raw[propertyName] == null) {
      throw new Error(`The property “${propertyName}” must not be null.`)
    }
  }

  /**
   * Cut a property from the raw object, that means delete the property.
   *
   * @param propertyName - The property of the object.
   *
   * @returns The data stored in the property
   */
  public cutAny (propertyName: string): any {
    if (this.raw[propertyName] == null) {
      const result = this.raw[propertyName]
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.raw[propertyName]
      return result
    }
  }

  public cutString (propertyName: string): string | undefined {
    if (this.raw[propertyName] == null) {
      return
    }
    this.checkString(propertyName)
    return this.cutAny(propertyName)
  }

  public cutStringNotNull (propertyName: string): string {
    this.checkNull(propertyName)
    this.checkString(propertyName)
    return this.cutAny(propertyName)
  }

  public cutNumberNotNull (propertyName: string): number {
    this.checkNull(propertyName)
    this.checkNumber(propertyName)
    return this.cutAny(propertyName)
  }

  public cutNotNull (propertyName: string): any {
    this.checkNull(propertyName)
    return this.cutAny(propertyName)
  }

  /**
   * Assert if the raw data object is empty.
   */
  public isEmpty (): boolean {
    if (Object.keys(this.raw).length === 0) {
      return true
    }
    return false
  }

  /**
   * Throw an exception if the stored raw data is not empty yet.
   *
   * @throws {Error} If the stored raw data is not empty yet.
   */
  public checkEmpty (): void {
    if (!this.isEmpty()) {
      throw Error(
        `Unknown properties in raw object: ${convertToString(this.raw)}`
      )
    }
  }
}
