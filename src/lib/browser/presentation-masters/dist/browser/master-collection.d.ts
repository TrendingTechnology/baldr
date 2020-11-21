import { Master } from './master';
import { MasterTypes } from '@bldr/type-definitions';
/**
 * Container for all registered master slides.
 */
export declare class MasterCollection {
    /**
     * A container object for all master objects.
     */
    private masters;
    constructor();
    /**
     * Add a master to the masters container.
     */
    add(master: Master): void;
    createMasterBySpec(masterSpec: MasterTypes.MasterSpec): void;
    /**
     * Get a master object by the master name.
     *
     * @param name - The name of the master slide.
     */
    get(name: string): Master;
    /**
     * Get all master objects as an object with the master name as properties.
     *
     * @returns {object}
     */
    get all(): {
        [key: string]: Master;
    };
    /**
     * Get all master names as an array.
     */
    get allNames(): string[];
    /**
     * Check if a master exist.
     *
     * @param name - The name of the master slide.
     */
    exists(name: string): boolean;
}
