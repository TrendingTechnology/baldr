"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const presentation_parser_1 = require("@bldr/presentation-parser");
const core_node_1 = require("@bldr/core-node");
const config_1 = __importDefault(require("@bldr/config"));
const assert_1 = __importDefault(require("assert"));
function readPresentationFile(filePath) {
    return core_node_1.readFile(path_1.default.join(config_1.default.localRepo, filePath));
}
function parseExample(fileBaseName) {
    return presentation_parser_1.parse(readPresentationFile(`src/vue/apps/lamp/examples/${fileBaseName}.baldr.yml`));
}
describe('Package “@bldr/presentation-parser”', function () {
    it('simple', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const presentation = parseExample('minimal');
            assert_1.default.strictEqual(presentation.slides[0].no, 1);
            assert_1.default.strictEqual(presentation.slides[1].no, 2);
        });
    });
});
