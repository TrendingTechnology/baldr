import { Master } from './master'
import type { LampTypes, StringIndexedObject } from '@bldr/type-definitions'
import { convertToString } from '@bldr/core-browser'

/**
 * Container for all registered master slides.
 */
export class MasterCollection {
  /**
   * A container object for all master objects.
   */
  private masters: { [key: string]: Master }

  constructor () {
    /**
     * A container object for all master objects.
     *
     * @type {Object}
     */
    this.masters = {}
  }

  /**
   * Add a master to the masters container.
   */
  add (master: Master): void {
    this.masters[master.name] = master
  }

  createMasterBySpec (masterSpec: LampTypes.MasterSpec): void {
    const master = new Master(masterSpec)
    this.add(master)
  }

  /**
   * Get a master object by the master name.
   *
   * @param name - The name of the master slide.
   */
  get (name: string): Master {
    if (!(name in this.masters)) {
      throw new Error(`Class Masters.get(): No master named “${name}”`)
    }
    return this.masters[name]
  }

  /**
   * Get all master objects as an object with the master name as properties.
   *
   * @returns {object}
   */
  get all (): { [key: string]: Master } {
    return this.masters
  }

  /**
   * Get all master names as an array.
   */
  get allNames (): string[] {
    return Object.keys(this.masters)
  }

  /**
   * Check if a master exist.
   *
   * @param name - The name of the master slide.
   */
  exists (name: string): boolean {
    if (name in this.masters) return true
    return false
  }

  /**
   * Find the name of the master by getting the intersection between all master
   * names and the slide keys.
   *
   * This method can be used to check that a slide object uses only one master
   * slide.
   *
   * @param data - The raw object of one slide unmodified from the YAML file.
   *
   * @returns An instance of the master.
   *
   * @throws If no master can be found and if more than one master name are
   * found.
   */
  findMaster (data: StringIndexedObject): Master {
    const rawProperties = Object.keys(data)
    const intersection = this.allNames.filter(
      (masterName) => rawProperties.includes(masterName)
    )

    if (intersection.length === 0) {
      throw Error(`No master slide found: ${convertToString(data)}`)
    }

    if (intersection.length > 1) {
      throw Error(`Each slide must have only one master slide: ${convertToString(data)}`)
    }

    return this.get(intersection[0])
  }
}
