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
 * Extract a string value from the parsed query string object.
 *
 * @param query - The parsed query string (`?param1=one&param2=two`) as an object.
 * @param key - The name of the query key.
 * @param defaultValue - A default value if the `query` is empty under the
 *   property `propertyName`.
 *
 * @returns The found parameter string or a default value
 *
 * @throws If not result string can be found.
 */
export function extractStringFromRequestQuery (
  query: Record<string, any>,
  key: string,
  defaultValue?: string
): string {
  if (query[key] == null || typeof query[key] !== 'string') {
    if (defaultValue != null) {
      return defaultValue
    } else {
      throw new Error(
        `No value could be found for the query string parameter “${key}” in the parsed query object.`
      )
    }
  }
  return query[key]
}

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
