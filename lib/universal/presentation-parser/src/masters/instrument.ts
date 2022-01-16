import { MasterSpec } from '../master-specification'

type InstrumentFieldsRaw = string | InstrumentFieldsNormalized

interface InstrumentFieldsNormalized {
  instrumentId: string
}

export class InstrumentMaster implements MasterSpec {
  name = 'instrument'

  displayName = 'Instrument'

  icon = {
    name: 'master-instrument',
    color: 'yellow',

    /**
     * U+1F3BA
     *
     * @see https://emojipedia.org/trumpet/
     */
    unicodeSymbol: '🎺'
  }

  fieldsDefintion = {
    instrumentId: {
      type: String,
      description:
        'Die ID des Instruments. Gleichlautend wie der Ordner in dem alle Medieninhalte liegen (z. B. Floete)'
    }
  }

  normalizeFieldsInput (fields: InstrumentFieldsRaw): InstrumentFieldsNormalized {
    if (typeof fields === 'string') {
      fields = {
        instrumentId: fields
      }
    }
    return fields
  }

  resolveMediaUris (fields: InstrumentFieldsNormalized): string {
    return this.convertInstrumentIdToMediaId(fields.instrumentId)
  }

  private convertInstrumentIdToMediaId (instrumentId: string) {
    return `ref:IN_${instrumentId}`
  }
}
