import { Master } from './_types';
export class ImageMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'image';
        this.displayName = 'Bild';
    }
}
