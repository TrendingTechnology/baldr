/**
 * A REST API to save states of the seating plan app.
 *
 */
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
import express from 'express';
import { database } from '../api';
export default function () {
    var _this = this;
    var app = express();
    app.post('/save-state', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
        var body, responseMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = request.body;
                    if (!{}.hasOwnProperty.call(body, 'timeStampMsec')) {
                        response.sendStatus(404);
                    }
                    return [4 /*yield*/, database.seatingPlan.insertOne(body)];
                case 1:
                    _a.sent();
                    responseMessage = {
                        success: body.timeStampMsec,
                        storedObject: body
                    };
                    response.json(responseMessage);
                    console.log(responseMessage);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/get-states', function (request, response) {
        database.seatingPlan
            .aggregate([{ $match: {} }, { $project: { timeStampMsec: 1, _id: 0 } }])
            .toArray(function (error, result) {
            if (error != null) {
                return response.status(500).send(error);
            }
            var states = [];
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var state = result_1[_i];
                states.push(state.timeStampMsec);
            }
            response.status(200).send(states);
        });
    });
    app.get('/latest', function (request, response) {
        database.seatingPlan
            .find()
            .sort({ timeStampMsec: -1 })
            .limit(1)
            .toArray(function (error, result) {
            if (error != null) {
                return response.status(500).send(error);
            }
            if (result.length > 0) {
                response.status(200).send(result[0]);
            }
            else {
                response.status(200).send('');
            }
        });
    });
    app.get('/get-state-by-time/:timeStampMsec', function (request, response) {
        database.seatingPlan
            .find({ timeStampMsec: parseInt(request.params.timeStampMsec) })
            .toArray(function (error, result) {
            if (error != null) {
                return response.status(500).send(error);
            }
            response.status(200).send(result);
        });
    });
    app.delete('/delete-state-by-time/:timeStampMsec', function (request, response) {
        database.seatingPlan.deleteOne({ timeStampMsec: parseInt(request.params.timeStampMsec) }, {}, function (error, result) {
            if (error != null) {
                return response.status(500).send(error);
            }
            var message = {
                deletedCount: result.deletedCount,
                timeStampMsec: parseInt(request.params.timeStampMsec)
            };
            if (result.deletedCount === 1) {
                return response.status(200).send(message);
            }
            else {
                return response.status(500).send(message);
            }
        });
    });
    return app;
}
