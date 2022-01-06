"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipartSelection = void 0;
const core_browser_1 = require("@bldr/core-browser");
/**
 * A multipart asset can be restricted in different ways. This class holds the
 * data of the restriction (for example all parts, only a single part, a
 * subset of parts). A multi part asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
class MultipartSelection {
    /**
     * @param selectionSpec - Can be a URI, everthing after `#`, for
     * example `ref:Song-2#2-5` -> `2-5`
     */
    constructor(asset, selectionSpec) {
        this.selectionSpec = selectionSpec.replace(/^.*#/, '');
        this.asset = asset;
        this.partNos = (0, core_browser_1.buildSubsetIndexes)(this.selectionSpec, this.asset.multiPartCount, 0);
    }
    /**
     * The URI using the `ref` authority. Prefixed with `ref:`
     */
    get ref() {
        return `${this.asset.ref}#${this.selectionSpec}`;
    }
    /**
     * We imitate the class “Asset”. ExternalSites.vue requires .meta.
     */
    get meta() {
        return this.asset.meta;
    }
    /**
     * The number of parts of a multipart media asset.
     */
    get multiPartCount() {
        return this.partNos.length;
    }
    /**
     * Used for the preview to fake that this class is a normal asset.
     */
    get httpUrl() {
        return this.getMultiPartHttpUrlByNo(1);
    }
    /**
     * Retrieve the HTTP URL of the multi part asset by the part number.
     *
     * @param The part number starts with 1. We set a default value,
     * because no is sometimes undefined when only one part is selected. The
     * router then creates no step url (not /slide/1/step/1) but (/slide/1)
     */
    getMultiPartHttpUrlByNo(no = 1) {
        return this.asset.getMultiPartHttpUrlByNo(this.partNos[no - 1]);
    }
}
exports.MultipartSelection = MultipartSelection;
