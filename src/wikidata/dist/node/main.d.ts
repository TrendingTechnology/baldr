/**
 * @module @bldr/wikidata
 */
declare type fromEntityType = 'getDescription' | 'getLabel' | 'getWikipediaTitle';
declare type predefinedFormatFunction = 'formatDate' | 'formatYear' | 'formatWikicommons' | 'formatList';
/**
 * The specification of a property.
 */
export interface WikidataPropSpec {
    /**
     * for example `P123` or `['P123', 'P234']`. If `fromClaim` is an
     * array, the first existing claim an a certain item is taken.
     */
    fromClaim: string | string[];
    /**
     * `getDescription`, `getLabel`, `getWikipediaTitle`. If `fromClaim`
     * is specifed and the item has a value on this claim, `fromEntity` is
     * omitted.
     */
    fromEntity: fromEntityType;
    /**
     * `queryLabels`
     */
    secondQuery: string;
    alwaysUpdate: true;
    /**
     * A function or `formatDate`, `formatYear`, `formatWikicommons`,
     * `formatList`, `formatSingleValue`.
     */
    format: Function | predefinedFormatFunction;
}
export {};
