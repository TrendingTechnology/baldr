"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuestionStepController = exports.buildTextStepController = exports.buildSvgStepController = exports.buildClozeStepController = void 0;
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
function buildTextStepController(entry, fields) {
    let selector;
    if (fields == null) {
        fields = {};
    }
    if (fields.stepMode == null) {
        fields.stepMode = 'words';
    }
    if (fields.stepMode === 'words') {
        selector = new selector_1.WordSelector(entry);
    }
    else {
        selector = new selector_1.SentenceSelector(entry);
    }
    console.log(selector, entry);
    return new controller_1.StepController(selector.select(), fields.stepSubset);
}
exports.buildTextStepController = buildTextStepController;
function buildQuestionStepController(entry) {
    const selector = new selector_1.ElementSelector(entry, '.answer');
    return new controller_1.StepController(selector.select());
}
exports.buildQuestionStepController = buildQuestionStepController;
