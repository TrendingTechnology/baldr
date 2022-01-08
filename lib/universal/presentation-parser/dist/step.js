export class StepCollector {
    steps;
    constructor() {
        this.steps = [];
    }
    add(spec) {
        const no = this.steps.length + 1;
        if (typeof spec === 'string') {
            this.steps.push({ no, title: spec });
        }
        else {
            this.steps.push(Object.assign({ no }, spec));
        }
    }
}
