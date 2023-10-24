import { LIB_VERSION } from 'electric-sql/version'
import { makeElectricContext } from 'electric-sql/react'
import { uniqueTabId, genUUID } from 'electric-sql/util'
import { insecureAuthToken } from 'electric-sql/auth'
import { electrify, ElectricDatabase } from 'electric-sql/wa-sqlite'
import { Electric, schema } from './generated/client'
export type { Issue } from './generated/client'

export const { ElectricProvider, useElectric } = makeElectricContext<Electric>()

const discriminator = 'linearlite'
const distPath = '/'

// import.meta.env is a special object that Vite provides for accessing
// environment variables at build time and runtime.
// They are replaced at build time with the actual values.
// https://vitejs.dev/guide/env-and-mode.html
const ELECTRIC_URL = import.meta.env.ELECTRIC_URL

// DEBUG defaults to true in dev mode, false in prod mode
export const DEBUG = true

// We export dbName so that we can delete the database if the schema changes
export let dbName: string

export const initElectric = async () => {
  const { tabId } = uniqueTabId()
  const electricUrl = ELECTRIC_URL ?? 'ws://localhost:5133'
  dbName = `${discriminator}-${LIB_VERSION}-${tabId}.db`

  const config = {
    auth: {
      token: insecureAuthToken({ user_id: genUUID() }),
    },
    url: electricUrl,
    debug: DEBUG,
  }

  const conn = await ElectricDatabase.init(dbName, distPath)
  if (DEBUG) {
    console.log('initElectric')
    console.log('dbName', dbName)
    console.log(conn)
    console.log(schema)
    console.log(config)
  }
  return await electrify(conn, schema, config)
}
