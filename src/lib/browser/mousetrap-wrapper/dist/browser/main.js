/**
 * Wrapper around {@link https://craig.is/killing/mice mousetrap}.
 *
 * https://github.com/ccampbell/mousetrap/blob/master/plugins/pause/mousetrap-pause.js
 */
/* eslint-disable @typescript-eslint/no-this-alias */
import M from 'mousetrap';
export const Mousetrap = M;
var _originalStopCallback = M.prototype.stopCallback;
M.prototype.stopCallback = function (e, element, combo) {
    var self = this;
    if (self.paused != null) {
        return true;
    }
    return _originalStopCallback.call(self, e, element, combo);
};
M.prototype.pause = function () {
    var self = this;
    self.paused = true;
};
M.prototype.unpause = function () {
    var self = this;
    self.paused = false;
};
M.init();
