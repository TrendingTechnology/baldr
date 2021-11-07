import { MediaUri } from '@bldr/client-media-models';
import { mapStepFieldDefintions } from '../master';
export class ClozeMaster {
    constructor() {
        this.name = 'cloze';
        this.displayName = 'Lückentext';
        this.icon = {
            name: 'cloze',
            color: 'blue'
        };
        this.fieldsDefintion = Object.assign({ src: {
                type: String,
                required: true,
                description: 'Den URI zu einer SVG-Datei, die den Lückentext enthält.',
                assetUri: true
            } }, mapStepFieldDefintions(['subset']));
    }
    normalizeFields(fields) {
        if (typeof fields === 'string') {
            fields = { src: fields };
        }
        const uri = new MediaUri(fields.src);
        if (uri.fragment != null) {
            if (fields.stepSubset == null) {
                fields.stepSubset = uri.fragment;
            }
            fields.src = uri.uriWithoutFragment;
        }
        return fields;
    }
    collectMediaUris(props) {
        return props.src;
    }
}
