"use strict";
/**
 * A REST API to save states of the seating plan app.
 * @module @bldr/api-seating-plan
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRestApi = void 0;
// Third party packages.
var express_1 = __importDefault(require("express"));
function registerRestApi(database) {
    var app = express_1.default();
    app.post('/save-state', function (req, res) {
        var body = req.body;
        if (!{}.hasOwnProperty.call(body, 'timeStampMsec')) {
            res.sendStatus(404);
        }
        database.seatingPlan.insertOne(body);
        var responseMessage = {
            success: body.timeStampMsec,
            storedObject: body
        };
        res.json(responseMessage);
        console.log(responseMessage);
    });
    app.get('/get-states', function (req, res) {
        database.seatingPlan.aggregate([{ $match: {} }, { $project: { timeStampMsec: 1, _id: 0 } }]).toArray(function (error, result) {
            if (error) {
                return res.status(500).send(error);
            }
            var states = [];
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var state = result_1[_i];
                states.push(state.timeStampMsec);
            }
            res.status(200).send(states);
        });
    });
    app.get('/latest', function (req, res) {
        database.seatingPlan.find().sort({ timeStampMsec: -1 }).limit(1).toArray(function (error, result) {
            if (error) {
                return res.status(500).send(error);
            }
            if (result.length > 0) {
                res.status(200).send(result[0]);
            }
            else {
                res.status(200).send('');
            }
        });
    });
    app.get('/get-state-by-time/:timeStampMsec', function (req, res) {
        database.seatingPlan.find({ timeStampMsec: parseInt(req.params.timeStampMsec) }).toArray(function (error, result) {
            if (error) {
                return res.status(500).send(error);
            }
            res.status(200).send(result);
        });
    });
    app.delete('/delete-state-by-time/:timeStampMsec', function (req, res) {
        database.seatingPlan.deleteOne({ timeStampMsec: parseInt(req.params.timeStampMsec) }, {}, function (error, result) {
            if (error) {
                return res.status(500).send(error);
            }
            var message = {
                deletedCount: result.deletedCount,
                timeStampMsec: parseInt(req.params.timeStampMsec)
            };
            if (result.deletedCount === 1) {
                return res.status(200).send(message);
            }
            else {
                return res.status(500).send(message);
            }
        });
    });
    return app;
}
exports.registerRestApi = registerRestApi;
