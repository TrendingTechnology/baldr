import { Master } from './master';
/**
 * Container for all registered master slides.
 */
export class MasterCollection {
    constructor() {
        /**
         * A container object for all master objects.
         *
         * @type {Object}
         */
        this.masters = {};
    }
    /**
     * Add a master to the masters container.
     */
    add(master) {
        this.masters[master.name] = master;
    }
    createMasterBySpec(masterSpec) {
        const master = new Master(masterSpec);
        this.add(master);
    }
    /**
     * Get a master object by the master name.
     *
     * @param name - The name of the master slide.
     */
    get(name) {
        if (!(name in this.masters)) {
            throw new Error(`Class Masters.get(): No master named “${name}”`);
        }
        return this.masters[name];
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
        if (name in this.masters)
            return true;
        return false;
    }
}
