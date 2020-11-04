"use strict";
/**
 * A REST API to save states of the seating plan app.
 * @module @bldr/api-seating-plan
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSeatingPlan = void 0;
// Third party packages.
const express_1 = __importDefault(require("express"));
function registerSeatingPlan(database) {
    const app = express_1.default();
    app.post('/save-state', (req, res) => {
        const body = req.body;
        if (!{}.hasOwnProperty.call(body, 'timeStampMsec')) {
            res.sendStatus(404);
        }
        database.seatingPlan.insertOne(body);
        const responseMessage = {
            success: body.timeStampMsec,
            storedObject: body
        };
        res.json(responseMessage);
        console.log(responseMessage);
    });
    app.get('/get-states', (req, res) => {
        database.seatingPlan.aggregate([{ $match: {} }, { $project: { timeStampMsec: 1, _id: 0 } }]).toArray((error, result) => {
            if (error) {
                return res.status(500).send(error);
            }
            const states = [];
            for (const state of result) {
                states.push(state.timeStampMsec);
            }
            res.status(200).send(states);
        });
    });
    app.get('/latest', (req, res) => {
        database.seatingPlan.find().sort({ timeStampMsec: -1 }).limit(1).toArray((error, result) => {
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
    app.get('/get-state-by-time/:timeStampMsec', (req, res) => {
        database.seatingPlan.find({ timeStampMsec: parseInt(req.params.timeStampMsec) }).toArray((error, result) => {
            if (error) {
                return res.status(500).send(error);
            }
            res.status(200).send(result);
        });
    });
    app.delete('/delete-state-by-time/:timeStampMsec', (req, res) => {
        database.seatingPlan.deleteOne({ timeStampMsec: parseInt(req.params.timeStampMsec) }, {}, (error, result) => {
            if (error) {
                return res.status(500).send(error);
            }
            const message = {
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
exports.registerSeatingPlan = registerSeatingPlan;
