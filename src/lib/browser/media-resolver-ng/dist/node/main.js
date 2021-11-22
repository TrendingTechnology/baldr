"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.updateMediaServer = exports.Resolver = void 0;
/**
 * Submodule dependencies
 *
 * ```
 * cache.ts, sample.ts -> asset.ts
 * asset.ts, cache.ts -> resolve.ts
 * resolve.ts -> main.ts
 * ```
 */
var resolve_1 = require("./resolve");
Object.defineProperty(exports, "Resolver", { enumerable: true, get: function () { return resolve_1.Resolver; } });
Object.defineProperty(exports, "updateMediaServer", { enumerable: true, get: function () { return resolve_1.updateMediaServer; } });
var http_request_1 = require("@bldr/http-request");
Object.defineProperty(exports, "get", { enumerable: true, get: function () { return http_request_1.get; } });
