"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMaster = void 0;
const master_1 = require("../master");
class GroupMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'group';
        this.displayName = 'Gruppe';
        this.icon = {
            name: 'account-group',
            color: 'orange'
        };
        this.fieldsDefintion = {
            groupId: {
                type: String,
                required: true,
                description: 'Die ID der Gruppe (z. B. „Beatles_The“).'
            }
        };
    }
}
exports.GroupMaster = GroupMaster;
