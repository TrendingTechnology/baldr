"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClozeStepController = void 0;
const selector_1 = require("./selector");
const controller_1 = require("./controller");
function createClozeStepController(entry, stepSubset) {
    const selector = new selector_1.ClozeSelector(entry);
    return new controller_1.StepController(selector.select(), stepSubset);
}
exports.createClozeStepController = createClozeStepController;
