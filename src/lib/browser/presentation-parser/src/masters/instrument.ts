import { Master } from '../master'

export class InstrumentMaster extends Master {
  name = 'instrument'

  displayName = 'Instrument'

  icon = {
    name: 'instrument',
    color: 'yellow'
  }

  fieldsDefintion = {
    instrumentId: {
      type: String,
      description:
        'Die ID des Instruments. Gleichlautend wie der Ordner in dem alle Medieninhalte liegen (z. B. Floete)'
    }
  }
}
