var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Third party packages.
import cors from 'cors';
import express from 'express';
// Project packages.
import { getConfig } from '@bldr/config';
import { connectDb, Database } from '@bldr/mongodb-connector';
// Submodules.
import registerSeatingPlan from './modules/seating-plan';
import registerMedia from './modules/media';
var config = getConfig();
export var database;
/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param port - A TCP port.
 */
export function startRestApi(port) {
    return __awaiter(this, void 0, void 0, function () {
        var app, mongoClient, helpMessages, usedPort;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = express();
                    return [4 /*yield*/, connectDb()];
                case 1:
                    mongoClient = _a.sent();
                    database = new Database(mongoClient.db());
                    return [4 /*yield*/, database.initialize()];
                case 2:
                    _a.sent();
                    app.use(cors());
                    app.use(express.json());
                    app.use('/seating-plan', registerSeatingPlan());
                    app.use('/media', registerMedia());
                    helpMessages = {};
                    app.get('/', function (request, response) {
                        response.json({
                            navigation: {
                                media: helpMessages.navigation
                            }
                        });
                    });
                    if (port == null) {
                        usedPort = config.api.port;
                    }
                    else {
                        usedPort = port;
                    }
                    app.listen(usedPort, function () {
                        console.log("The BALDR REST API is running on port ".concat(usedPort, "."));
                    });
                    return [2 /*return*/, app];
            }
        });
    });
}
