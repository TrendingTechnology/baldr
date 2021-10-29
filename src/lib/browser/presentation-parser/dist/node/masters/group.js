"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMaster = void 0;
const _types_1 = require("./_types");
class GroupMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'group';
        this.displayName = 'Gruppe';
    }
}
exports.GroupMaster = GroupMaster;
