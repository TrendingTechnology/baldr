export class GroupMaster {
    constructor() {
        this.name = 'group';
        this.displayName = 'Gruppe';
        this.icon = {
            name: 'master-group',
            color: 'orange',
            /**
             * U+1F93C
             *
             * @see https://emojipedia.org/people-wrestling/
             */
            unicodeSymbol: '🤼'
        };
        this.fieldsDefintion = {
            groupId: {
                type: String,
                required: true,
                description: 'Die ID der Gruppe (z. B. „Beatles_The“).'
            }
        };
        this.shortFormField = 'groupId';
    }
    collectMediaUris(fields) {
        return this.convertGroupIdToMediaId(fields.groupId);
    }
    convertGroupIdToMediaId(groupId) {
        return `ref:GR_${groupId}`;
    }
}
