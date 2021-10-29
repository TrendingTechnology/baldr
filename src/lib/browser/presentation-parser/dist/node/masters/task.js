"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMaster = void 0;
const _types_1 = require("./_types");
class TaskMaster extends _types_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'task';
        this.displayName = 'Arbeitsauftrag';
    }
}
exports.TaskMaster = TaskMaster;
