"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const core_browser_1 = require("@bldr/core-browser");
describe('function selectSubset()', function () {
    it('3-', function () {
        const elements = core_browser_1.selectSubset('3-', {
            elementsCount: 5,
            firstElementNo: 1
        });
        assert_1.default.deepStrictEqual(elements, [3, 4, 5]);
    });
    it('3-', function () {
        const elements = core_browser_1.selectSubset('-3', {
            elementsCount: 5,
            firstElementNo: 1
        });
        assert_1.default.deepStrictEqual(elements, [1, 2, 3]);
    });
    it('1,3,5', function () {
        const elements = core_browser_1.selectSubset('1,3,5', {
            elementsCount: 5,
            firstElementNo: 1
        });
        assert_1.default.deepStrictEqual(elements, [1, 3, 5]);
    });
    it('1-2,4-5', function () {
        const elements = core_browser_1.selectSubset('1-2,4-5', {
            elementsCount: 5,
            firstElementNo: 1
        });
        assert_1.default.deepStrictEqual(elements, [1, 2, 4, 5]);
    });
    it('firstElementNo: unset', function () {
        const elements = core_browser_1.selectSubset('', {
            elementsCount: 5,
        });
        assert_1.default.deepStrictEqual(elements, [0, 1, 2, 3, 4]);
    });
    it('firstElementNo: 1', function () {
        const elements = core_browser_1.selectSubset('', {
            elementsCount: 5,
            firstElementNo: 1
        });
        assert_1.default.deepStrictEqual(elements, [1, 2, 3, 4, 5]);
    });
    it('firstElementNo: 2', function () {
        const elements = core_browser_1.selectSubset('', {
            elementsCount: 5,
            firstElementNo: 2
        });
        assert_1.default.deepStrictEqual(elements, [2, 3, 4, 5, 6]);
    });
    it('shiftSelector: -1', function () {
        const elements = core_browser_1.selectSubset('3-', {
            elementsCount: 5,
            firstElementNo: 1,
            shiftSelector: -1
        });
        assert_1.default.deepStrictEqual(elements, [2, 3, 4, 5]);
    });
    it('shiftSelector: -1 (3-5)', function () {
        const elements = core_browser_1.selectSubset('3-5', {
            elementsCount: 5,
            firstElementNo: 1,
            shiftSelector: -1
        });
        assert_1.default.deepStrictEqual(elements, [2, 3, 4]);
    });
    it('shiftSelector: -1 (-4)', function () {
        const elements = core_browser_1.selectSubset('-4', {
            elementsCount: 5,
            firstElementNo: 1,
            shiftSelector: -1
        });
        assert_1.default.deepStrictEqual(elements, [1, 2, 3]);
    });
    it('shiftSelector: -1 (-4)', function () {
        const elements = core_browser_1.selectSubset('-4', {
            elementsCount: 5,
            shiftSelector: -1
        });
        assert_1.default.deepStrictEqual(elements, [0, 1, 2]);
    });
    it('shiftSelector: -2', function () {
        const elements = core_browser_1.selectSubset('3-', {
            elementsCount: 5,
            firstElementNo: 1,
            shiftSelector: -2
        });
        assert_1.default.deepStrictEqual(elements, [1, 2, 3, 4, 5]);
    });
});
describe('function convertDurationToSeconds()', function () {
    it('Input integer', function () {
        let convert = core_browser_1.convertDurationToSeconds;
        assert_1.default.deepStrictEqual(convert(1), 1);
        assert_1.default.deepStrictEqual(convert('1'), 1);
        assert_1.default.deepStrictEqual(convert('1:01'), 61);
        assert_1.default.deepStrictEqual(convert('01:00'), 60);
        assert_1.default.deepStrictEqual(convert('1:00:00'), 3600);
    });
});
