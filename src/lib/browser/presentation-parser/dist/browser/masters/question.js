import { Master } from '../master';
export class QuestionMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'question';
        this.displayName = 'Frage';
    }
}
