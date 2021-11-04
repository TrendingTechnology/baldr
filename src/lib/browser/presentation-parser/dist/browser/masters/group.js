export class GroupMaster {
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
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            return {
                groupId: fields
            };
        }
        return fields;
    }
    collectMediaUris(fields) {
        return this.convertGroupIdToMediaId(fields.groupId);
    }
    convertGroupIdToMediaId(groupId) {
        return `ref:GR_${groupId}`;
    }
}
