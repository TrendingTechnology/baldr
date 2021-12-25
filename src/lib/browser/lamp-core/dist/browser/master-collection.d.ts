import { LampTypes, StringIndexedObject } from '@bldr/type-definitions';
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
    add(master: LampTypes.Master): void;
    /**
     * Get a master object by the master name.
     *
     * @param name - The name of the master slide.
     */
    get(name: string): LampTypes.Master;
    /**
     * Get all master objects as an object with the master name as properties.
     *
     * @returns {object}
     */
    get all(): {
        [key: string]: LampTypes.Master;
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
    findMaster(data: StringIndexedObject): LampTypes.Master;
}
export declare const masterCollection: MasterCollection;
