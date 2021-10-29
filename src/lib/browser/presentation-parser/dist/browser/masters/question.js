import { Master } from './_types';
export class QuestionMaster extends Master {
    constructor() {
        super(...arguments);
        this.name = 'question';
        this.displayName = 'Frage';
    }
}
