"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongMaster = void 0;
class SongMaster {
    constructor() {
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
