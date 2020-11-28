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
    it('Property „presentation.meta“', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const presentation = parseExample('metaData');
            assert_1.default.strictEqual(presentation.meta.id, 'EP_common_metaData');
            assert_1.default.strictEqual(presentation.meta.title, 'Slide meta data');
            assert_1.default.strictEqual(presentation.meta.subtitle, 'A subtitle');
            assert_1.default.strictEqual(presentation.meta.grade, 7);
            assert_1.default.strictEqual(presentation.meta.curriculum, 'Topic 1 / Topic 2');
            assert_1.default.strictEqual(presentation.meta.curriculumUrl, 'https://de.wikipedia.org');
        });
    });
    it('Property „slide.meta“', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const presentation = parseExample('metaData');
            const slides = presentation.slides;
            assert_1.default.strictEqual(slides[0].meta.id, 'slide_first');
            assert_1.default.strictEqual(slides[0].meta.title, undefined);
            assert_1.default.strictEqual(slides[0].meta.source, undefined);
            assert_1.default.strictEqual(slides[0].meta.description, undefined);
            assert_1.default.strictEqual(slides[1].meta.title, 'This slide has a <em>title</em>.');
            assert_1.default.strictEqual(slides[2].meta.description, 'This slide has a <em>description</em>.');
            assert_1.default.strictEqual(slides[3].meta.source, '<a href="http://example.com">http://example.com</a>');
            assert_1.default.strictEqual(slides[4].meta.id, 'all');
            assert_1.default.strictEqual(slides[4].meta.title, 'This slide has a title.');
            assert_1.default.strictEqual(slides[4].meta.source, 'This slide has a source.');
            assert_1.default.strictEqual(slides[4].meta.description, 'This slide has a description.');
            assert_1.default.strictEqual(slides[5].meta.title, 'This is <em>starred (italic)</em>.');
            assert_1.default.strictEqual(slides[5].meta.source, 'This is <strong>bold</strong>.');
            assert_1.default.strictEqual(slides[5].meta.description, '<h1 id="heading-1">Heading 1</h1>\n' +
                '<ol>\n' +
                '<li>one</li>\n' +
                '<li>two</li>\n' +
                '<li>three</li>\n' +
                '</ol>\n');
        });
    });
});
