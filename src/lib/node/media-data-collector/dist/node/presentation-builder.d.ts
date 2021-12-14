import { Builder, MediaData } from './builder';
interface PresentationData extends MediaData {
}
/**
 * The whole presentation YAML file converted to an Javascript object. All
 * properties are in `camelCase`.
 */
export declare class PresentationBuilder extends Builder {
    data: PresentationData;
    /**
     * The plain text version of `this.meta.title`.
     */
    /**
     * The plain text version of `this.meta.title (this.meta.subtitle)`
     */
    /**
     * The plain text version of `folderTitles.allTitles
     * (this.meta.subtitle)`
     *
     * For example:
     *
     * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
     * Johann Sebastian Bach: Musik als Bekenntnis /
     * Johann Sebastian Bachs Reise nach Berlin 1747 (Ricercar a 3)
     */
    /**
     * Value is the same as `meta.ref`
     */
    constructor(filePath: string);
    buildAll(): this;
    export(): PresentationData;
}
export {};
