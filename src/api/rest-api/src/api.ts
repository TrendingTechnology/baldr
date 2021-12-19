// Third party packages.
import cors from 'cors'
import express from 'express'

// Project packages.
import { getConfig } from '@bldr/config'
import { StringIndexedObject } from '@bldr/type-definitions'
import { connectDb, Database } from '@bldr/mongodb-connector'

// Submodules.
import registerSeatingPlan from './modules/seating-plan'
import registerMedia from './modules/media'

const config = getConfig()

export let database: Database

/* Express Rest API ***********************************************************/

/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param port - A TCP port.
 */
export async function startRestApi (port?: number): Promise<express.Express> {
  const app = express()

  const mongoClient = await connectDb()
  database = new Database(mongoClient.db())
  await database.initialize()

  app.use(cors())
  app.use(express.json())

  app.use('/seating-plan', registerSeatingPlan())
  app.use('/media', registerMedia())

  const helpMessages: StringIndexedObject = {}

  app.get('/', (request, response) => {
    response.json({
      navigation: {
        media: helpMessages.navigation
      }
    })
  })

  let usedPort: number
  if (port == null) {
    usedPort = config.api.port
  } else {
    usedPort = port
  }
  app.listen(usedPort, () => {
    console.log(`The BALDR REST API is running on port ${usedPort}.`)
  })
  return app
}
