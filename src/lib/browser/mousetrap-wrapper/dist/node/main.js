"use strict";
/**
 * Wrapper around {@link https://craig.is/killing/mice mousetrap}.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mousetrap = void 0;
const mousetrap_1 = __importDefault(require("mousetrap"));
exports.Mousetrap = mousetrap_1.default;
// https://github.com/ccampbell/mousetrap/blob/master/plugins/pause/mousetrap-pause.js
var _originalStopCallback = mousetrap_1.default.prototype.stopCallback;
mousetrap_1.default.prototype.stopCallback = function (e, element, combo) {
    var self = this;
    if (self.paused) {
        return true;
    }
    return _originalStopCallback.call(self, e, element, combo);
};
mousetrap_1.default.prototype.pause = function () {
    var self = this;
    self.paused = true;
};
mousetrap_1.default.prototype.unpause = function () {
    var self = this;
    self.paused = false;
};
mousetrap_1.default.init();
