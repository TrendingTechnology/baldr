"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSvgStepController = exports.buildClozeStepController = void 0;
const selector_1 = require("./selector");
const controller_1 = require("./controller");
function buildClozeStepController(entry, stepSubset) {
    const selector = new selector_1.ClozeSelector(entry);
    return new controller_1.StepController(selector.select(), stepSubset);
}
exports.buildClozeStepController = buildClozeStepController;
function buildSvgStepController(entry, fields) {
    let selector;
    if (fields.stepSelector != null) {
        selector = new selector_1.ElementSelector(entry, fields.stepSelector);
    }
    else {
        selector = new selector_1.InkscapeSelector(entry, fields.mode);
    }
    return new controller_1.StepController(selector.select(), fields.stepSubset);
}
exports.buildSvgStepController = buildSvgStepController;
