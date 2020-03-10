import { config } from './app.config'
import server from './presentation/server'

server.start(config)
  .catch(err => {
    console.error('===== Fatal Error =====')
    console.error(err)
  })
