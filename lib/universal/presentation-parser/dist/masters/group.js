export class GroupMaster {
    name = 'group';
    displayName = 'Gruppe';
    icon = {
        name: 'account-group',
        color: 'orange',
        /**
         * U+1F93C
         *
         * @see https://emojipedia.org/people-wrestling/
         */
        unicodeSymbol: '🤼'
    };
    fieldsDefintion = {
        groupId: {
            type: String,
            required: true,
            description: 'Die ID der Gruppe (z. B. „Beatles_The“).'
        }
    };
    shortFormField = 'groupId';
    collectMediaUris(fields) {
        return this.convertGroupIdToMediaId(fields.groupId);
    }
    convertGroupIdToMediaId(groupId) {
        return `ref:GR_${groupId}`;
    }
}
