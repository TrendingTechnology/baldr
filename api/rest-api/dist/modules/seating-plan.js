/**
 * A REST API to save states of the seating plan app.
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
import express from 'express';
import { database } from '../api';
export default function () {
    const app = express();
    app.post('/save-state', (request, response) => __awaiter(this, void 0, void 0, function* () {
        const body = request.body;
        if (!{}.hasOwnProperty.call(body, 'timeStampMsec')) {
            response.sendStatus(404);
        }
        yield database.seatingPlan.insertOne(body);
        const responseMessage = {
            success: body.timeStampMsec,
            storedObject: body
        };
        response.json(responseMessage);
        console.log(responseMessage);
    }));
    app.get('/get-states', (request, response) => {
        database.seatingPlan
            .aggregate([{ $match: {} }, { $project: { timeStampMsec: 1, _id: 0 } }])
            .toArray((error, result) => {
            if (error != null) {
                return response.status(500).send(error);
            }
            const states = [];
            for (const state of result) {
                states.push(state.timeStampMsec);
            }
            response.status(200).send(states);
        });
    });
    app.get('/latest', (request, response) => {
        database.seatingPlan
            .find()
            .sort({ timeStampMsec: -1 })
            .limit(1)
            .toArray((error, result) => {
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
    app.get('/get-state-by-time/:timeStampMsec', (request, response) => {
        database.seatingPlan
            .find({ timeStampMsec: parseInt(request.params.timeStampMsec) })
            .toArray((error, result) => {
            if (error != null) {
                return response.status(500).send(error);
            }
            response.status(200).send(result);
        });
    });
    app.delete('/delete-state-by-time/:timeStampMsec', (request, response) => {
        database.seatingPlan.deleteOne({ timeStampMsec: parseInt(request.params.timeStampMsec) }, {}, (error, result) => {
            if (error != null) {
                return response.status(500).send(error);
            }
            const message = {
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
