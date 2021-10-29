import { Master } from '../master';
export class ImageMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'image';
        this.displayName = 'Bild';
    }
}
