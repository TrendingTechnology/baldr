import { Master } from '../master';
export class ScoreSampleMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'scoreSample';
        this.displayName = 'Notenbeispiel';
        this.icon = {
            name: 'file-audio',
            color: 'black'
        };
        this.fieldsDefintion = {
            heading: {
                type: String,
                description: 'Eine Überschrift',
                markup: true
            },
            score: {
                type: String,
                description: 'URI zu einer Bild-Datei, dem Notenbeispiel.',
                assetUri: true,
                required: true
            },
            audio: {
                type: String,
                description: 'URI der entsprechenden Audio-Datei oder des Samples.',
                assetUri: true
            }
        };
    }
}
