"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTests = void 0;
const path_1 = __importDefault(require("path"));
const mocha_1 = __importDefault(require("mocha"));
const config_1 = __importDefault(require("@bldr/config"));
function runTests() {
    const mocha = new mocha_1.default();
    config_1.default.localRepo;
    mocha.addFile(path_1.default.join(config_1.default.localRepo, 'src/mgmt/test/dist/node/specs/test.js'));
    mocha.run((failures) => {
        process.on('exit', () => {
            process.exit(failures);
        });
    });
}
exports.runTests = runTests;
