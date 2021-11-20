"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepCollector = void 0;
class StepCollector {
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
exports.StepCollector = StepCollector;
