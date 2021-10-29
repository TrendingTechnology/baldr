"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikipediaMaster = void 0;
const _types_1 = require("./_types");
class WikipediaMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'wikipedia';
        this.displayName = 'Wikipedia';
    }
}
exports.WikipediaMaster = WikipediaMaster;
