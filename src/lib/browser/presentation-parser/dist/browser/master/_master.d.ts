export declare abstract class Master {
    /**
     * The name of the master slide. A short name in lower case letters like `audio`.
     */
    abstract name: string;
    /**
     * A human readable name of the master slide.
     */
    abstract displayName: string;
}
export declare const masterCollection: {
    [masterName: string]: Master;
};
