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
export async function startRestApi(port) {
    const app = express();
    const mongoClient = await connectDb();
    database = new Database(mongoClient.db());
    await database.initialize();
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
}
