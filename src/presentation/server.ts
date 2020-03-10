import { app } from './app'
import server from '@expresso/server'
import { AppConfig } from '../app.config'

export async function start (config: AppConfig) {
  return server.start(app, config)
}

export default { start }
