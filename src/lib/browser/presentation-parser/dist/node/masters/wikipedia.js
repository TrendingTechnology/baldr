"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikipediaMaster = void 0;
const master_1 = require("../master");
class WikipediaMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'wikipedia';
        this.displayName = 'Wikipedia';
        this.icon = {
            name: 'wikipedia',
            color: 'black'
        };
    }
}
exports.WikipediaMaster = WikipediaMaster;
