export class SectionMaster {
    constructor() {
        this.name = 'section';
        this.displayName = 'Abschnitt';
        this.icon = {
            name: 'file-tree',
            color: 'orange-dark'
        };
        this.fieldsDefintion = {
            heading: {
                type: String,
                required: true,
                markup: true,
                description: 'Die Überschrift / der Titel des Abschnitts.'
            }
        };
    }
}
