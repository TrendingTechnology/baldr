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
const master_collection_1 = __importDefault(require("@bldr/master-collection"));
const assert_1 = __importDefault(require("assert"));
describe('Package “@bldr/master-collection”', function () {
    it('Class “Master()”: name', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const master = master_collection_1.default.get('quote');
            assert_1.default.strictEqual(master.name, 'quote');
        });
    });
    it('Class “Master()”: title', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const master = master_collection_1.default.get('quote');
            assert_1.default.strictEqual(master.title, 'Zitat');
        });
    });
});
