import { convertToString } from '@bldr/core-browser';
/**
 * Container for all registered master slides.
 */
export class MasterCollection {
    constructor() {
        /**
         * A container object for all master objects.
         */
        this.masters = {};
    }
    /**
     * Add a master to the masters container.
     */
    add(master) {
        this.masters[master.name] = master;
    }
    /**
     * Get a master object by the master name.
     *
     * @param name - The name of the master slide.
     */
    get(name) {
        if (this.masters[name] == null) {
            throw new Error(`Class Masters.get(): No master named “${name}”`);
        }
        const m = this.masters[name];
        return m;
    }
    /**
     * Get all master objects as an object with the master name as properties.
     *
     * @returns {object}
     */
    get all() {
        return this.masters;
    }
    /**
     * Get all master names as an array.
     */
    get allNames() {
        return Object.keys(this.masters);
    }
    /**
     * Check if a master exist.
     *
     * @param name - The name of the master slide.
     */
    exists(name) {
        return this.masters[name] != null;
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
    findMaster(data) {
        const rawProperties = Object.keys(data);
        const intersection = this.allNames.filter(masterName => rawProperties.includes(masterName));
        if (intersection.length === 0) {
            throw Error(`No master slide found: ${convertToString(data)}`);
        }
        if (intersection.length > 1) {
            throw Error(`Each slide must have only one master slide: ${convertToString(data)}`);
        }
        return this.get(intersection[0]);
    }
}
export const masterCollection = new MasterCollection();
