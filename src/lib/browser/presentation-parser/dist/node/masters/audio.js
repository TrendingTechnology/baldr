"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioMaster = void 0;
const master_1 = require("../master");
class AudioMaster extends master_1.Master {
    constructor() {
        super(...arguments);
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
}
exports.AudioMaster = AudioMaster;
