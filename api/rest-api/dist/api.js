var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cors from 'cors';
import express from 'express';
// Project packages.
import { getConfig } from '@bldr/config';
import { connectDb, Database } from '@bldr/mongodb-connector';
// Submodules.
import registerDatabase from './modules/database';
import registerMedia from './modules/media';
import registerSeatingPlan from './modules/seating-plan';
const config = getConfig();
export let database;
/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param port - A TCP port.
 */
export function startRestApi(port) {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express();
        const mongoClient = yield connectDb();
        database = new Database(mongoClient.db());
        yield database.initialize();
        app.use(cors());
        app.use(express.json());
        app.use('/database', registerDatabase());
        app.use('/media', registerMedia());
        app.use('/seating-plan', registerSeatingPlan());
        const helpMessages = {};
        app.get('/', (request, response) => {
            response.json({
                navigation: {
                    media: helpMessages.navigation
                }
            });
        });
        let usedPort;
        if (port == null) {
            usedPort = config.api.port;
        }
        else {
            usedPort = port;
        }
        app.listen(usedPort, () => {
            console.log(`The BALDR REST API is running on port ${usedPort}.`);
        });
        return app;
    });
}
