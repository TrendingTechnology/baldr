import { Master } from '../master';
export class CounterMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'counter';
        this.displayName = 'Zähler';
        this.iconSpec = {
            name: 'counter',
            color: 'black',
            size: 'large'
        };
    }
}
