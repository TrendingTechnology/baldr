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
const assert_1 = __importDefault(require("assert"));
const markdown_to_html_1 = require("@bldr/markdown-to-html");
function assertEqual(actual, expected) {
    assert_1.default.deepStrictEqual(markdown_to_html_1.convertMarkdownToHtml(actual), expected);
}
describe('Package “@bldr/markdown-to-html”', function () {
    it('arrows', function () {
        return __awaiter(this, void 0, void 0, function* () {
            assertEqual('test -> test', 'test → test');
        });
    });
    it('inline HTML', function () {
        return __awaiter(this, void 0, void 0, function* () {
            assertEqual('test <strong>strong</strong> test', 'test <strong>strong</strong> test');
        });
    });
    it('Paragraph', function () {
        return __awaiter(this, void 0, void 0, function* () {
            assertEqual('test\n\ntest', '<p>test</p>\n<p>test</p>\n');
        });
    });
    it('Array', function () {
        return __awaiter(this, void 0, void 0, function* () {
            assertEqual(['test *emph* test', 'test'], ['test <em>emph</em> test', 'test']);
        });
    });
    it('Object', function () {
        return __awaiter(this, void 0, void 0, function* () {
            assertEqual({ one: '__one__', two: '__two__' }, { one: '<strong>one</strong>', two: '<strong>two</strong>' });
        });
    });
});
