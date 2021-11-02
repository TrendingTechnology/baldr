export class AudioMaster {
    constructor() {
        this.name = 'audio';
        this.displayName = 'Hörbeispiel';
        this.icon = {
            name: 'music',
            color: 'brown'
        };
        this.fieldsDefintion = {
            src: {
                type: String,
                required: true,
                description: 'Eine Medien-Datei-URI, z. B. `ref:Fuer-Elise` oder eine Sample-URI (`ref:Fuer-Elise#complete`).',
                assetUri: true
            },
            title: {
                type: String,
                markup: true,
                description: 'Der Titel des Audio-Ausschnitts.',
                required: true
            },
            composer: {
                type: String,
                markup: true,
                description: 'Der/Die KomponistIn des Audio-Ausschnitts.'
            },
            artist: {
                type: String,
                markup: true,
                description: 'Der/Die InterpretIn des Audio-Ausschnitts.'
            },
            partOf: {
                type: String,
                markup: true,
                description: 'Teil eines übergeordneten Werks.'
            },
            cover: {
                type: String,
                description: 'Eine Medien-Datei-URI, die als Cover-Bild angezeigt werden soll.',
                assetUri: true
            },
            description: {
                type: String,
                markup: true,
                description: 'Ein längerer Beschreibungstext.'
            },
            autoplay: {
                type: Boolean,
                default: false,
                description: 'Den Audio-Ausschnitt automatisch abspielen.'
            },
            playthrough: {
                type: Boolean,
                default: false,
                description: 'Über die Folien hinwegspielen. Nicht stoppen beim Folienwechsel.'
            }
        };
    }
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            fields = { src: fields };
        }
        return fields;
    }
    resolveMediaUris(fields) {
        const uris = new Set([fields.src]);
        if (fields.cover) {
            uris.add(fields.cover);
        }
        return uris;
    }
    collectFields(fields, resolver) {
        const sample = resolver.getSampleSync(fields.src);
        if (sample == null) {
            throw new Error(`Sample couldn’t be resolved`);
        }
        const asset = sample.asset;
        // const grab = new ObjectPropertyPicker(props, asset.yaml)
        // const artist = grab.pickProperty('artist')
        // const composer = grab.pickProperty('composer')
        // const description = grab.pickProperty('description')
        // const partOf = grab.pickProperty('partOf')
        if (fields.title == null) {
            fields.title = sample.titleSafe;
        }
        // let previewHttpUrl
        // if (props.cover != null) {
        //   const coverFile = this.$store.getters['media/assetByUri'](props.cover)
        //   previewHttpUrl = coverFile.httpUrl
        // } else if (asset.previewHttpUrl != null) {
        //   previewHttpUrl = asset.previewHttpUrl
        // }
        // return {
        //   sample,
        //   previewHttpUrl,
        //   waveformHttpUrl: asset.waveformHttpUrl,
        //   artist,
        //   composer,
        //   title,
        //   partOf,
        //   description,
        //   mediaAsset: asset
        // }
        return fields;
    }
}
