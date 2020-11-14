"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTests = void 0;
process.env.TS_NODE_PROJECT = './src/tsconfig.json';
require("ts-mocha");
const mocha_1 = __importDefault(require("mocha"));
function runTests() {
    const mocha = new mocha_1.default();
    mocha.addFile('./specs/test.ts');
    mocha.run((failures) => {
        process.on('exit', () => {
            process.exit(failures); // exit with non-zero status if there were failures
        });
    });
}
exports.runTests = runTests;
