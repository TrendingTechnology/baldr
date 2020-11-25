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
const yaml_1 = require("@bldr/yaml");
const assert_1 = __importDefault(require("assert"));
function assertTo(actual, expected) {
    const result = yaml_1.convertToYaml(actual);
    assert_1.default.strictEqual(result, expected);
}
function assertFrom(actual, expected) {
    const result = yaml_1.convertFromYaml(actual);
    assert_1.default.deepStrictEqual(result, expected);
}
describe('Package “@bldr/yaml”', function () {
    describe('function convertObjectToYamlString()', function () {
        it('simple', function () {
            return __awaiter(this, void 0, void 0, function* () {
                assertTo({ aProperty: 'A value' }, '---\na_property: A value\n');
            });
        });
        it('nested', function () {
            return __awaiter(this, void 0, void 0, function* () {
                assertTo({ aProp: { bProp: { cProp: 'A value' } } }, '---\na_prop:\n  b_prop:\n    c_prop: A value\n');
            });
        });
    });
    describe('function convertYamlStringToObject()', function () {
        it('simple', function () {
            return __awaiter(this, void 0, void 0, function* () {
                assertFrom('---\na_property: A value\n', { aProperty: 'A value' });
            });
        });
        it('nested', function () {
            return __awaiter(this, void 0, void 0, function* () {
                assertFrom('---\na_prop:\n  b_prop:\n    c_prop: A value\n', { aProp: { bProp: { cProp: 'A value' } } });
            });
        });
    });
});
