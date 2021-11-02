"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMaster = void 0;
class GroupMaster {
    constructor() {
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
