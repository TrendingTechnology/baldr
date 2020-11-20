"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTests = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mocha_1 = __importDefault(require("mocha"));
const config_1 = __importDefault(require("@bldr/config"));
function runTests() {
    const mocha = new mocha_1.default();
    const testSpecsPath = path_1.default.join(config_1.default.localRepo, 'src/mgmt/test/dist/node/specs');
    fs_1.default.readdirSync(testSpecsPath).filter(function (file) {
        return file.substr(-3) === '.js';
    }).forEach(function (file) {
        mocha.addFile(path_1.default.join(testSpecsPath, file));
    });
    mocha.timeout(0);
    mocha.run((failures) => {
        process.on('exit', () => {
            process.exit(failures);
        });
    });
}
exports.runTests = runTests;
if (require.main === module) {
    runTests();
}
