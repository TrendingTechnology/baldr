"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMaster = void 0;
const master_1 = require("../master");
class TaskMaster extends master_1.Master {
    constructor() {
        super(...arguments);
        this.name = 'task';
        this.displayName = 'Arbeitsauftrag';
        this.iconSpec = {
            name: 'task',
            color: 'yellow-dark',
            size: 'large'
        };
    }
}
exports.TaskMaster = TaskMaster;
