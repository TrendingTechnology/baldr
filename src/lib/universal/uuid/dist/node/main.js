"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUuid = void 0;
const uuid_1 = require("uuid");
/**
 * Generate a UUID (Universally Unique Identifier) in version 4. A version 4
 * UUID is randomly generated. This is a small wrapper around `uuid.v4()`
 *
 * @returns An UUID version 4
 */
function generateUuid() {
    return (0, uuid_1.v4)();
}
exports.generateUuid = generateUuid;
