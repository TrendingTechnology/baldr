"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongMaster = void 0;
const master_1 = require("../master");
class SongMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'song';
        this.displayName = 'Lied';
        this.icon = {
            name: 'file-audio',
            color: 'green'
        };
        this.fieldsDefintion = {
            songId: {
                type: String,
                description: 'Die ID des Liedes'
            }
        };
    }
}
exports.SongMaster = SongMaster;
