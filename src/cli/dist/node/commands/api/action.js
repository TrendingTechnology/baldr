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
const rest_api_1 = require("@bldr/rest-api");
function action(port, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((opts === null || opts === void 0 ? void 0 : opts.restart) != null && (opts === null || opts === void 0 ? void 0 : opts.restart)) {
            (0, rest_api_1.restart)();
        }
        else {
            yield (0, rest_api_1.start)(port);
        }
    });
}
module.exports = action;
