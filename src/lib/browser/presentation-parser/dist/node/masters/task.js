"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMaster = void 0;
class TaskMaster {
    constructor() {
        this.name = 'task';
        this.displayName = 'Arbeitsauftrag';
        this.icon = {
            name: 'task',
            color: 'yellow-dark',
            size: 'large'
        };
        this.fieldsDefintion = {
            markup: {
                type: String,
                required: true,
                markup: true,
                description: 'Text im HTML oder Markdown-Format oder als reinen Text.'
            }
        };
    }
    normalizeFieldsInput(fields) {
        if (typeof fields === 'string') {
            fields = {
                markup: fields
            };
        }
        return fields;
    }
}
exports.TaskMaster = TaskMaster;
