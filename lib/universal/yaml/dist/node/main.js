"use strict";
/**
 * Parse YAML strings and convert Javascript data into YAML strings
 *
 * @module @bldr/yaml
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSnakeToCamel = exports.convertCamelToSnake = void 0;
__exportStar(require("./yaml"), exports);
var string_format_1 = require("./string-format");
Object.defineProperty(exports, "convertCamelToSnake", { enumerable: true, get: function () { return string_format_1.convertCamelToSnake; } });
Object.defineProperty(exports, "convertSnakeToCamel", { enumerable: true, get: function () { return string_format_1.convertSnakeToCamel; } });
__exportStar(require("./object-manipulation"), exports);
