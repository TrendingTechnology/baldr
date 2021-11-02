import { Master } from '../master';
export class InstrumentMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'instrument';
        this.displayName = 'Instrument';
        this.icon = {
            name: 'instrument',
            color: 'yellow'
        };
        this.fieldsDefintion = {
            instrumentId: {
                type: String,
                description: 'Die ID des Instruments. Gleichlautend wie der Ordner in dem alle Medieninhalte liegen (z. B. Floete)'
            }
        };
    }
}
