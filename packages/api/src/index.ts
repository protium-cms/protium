import {createLogger} from '@protium/core'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import Express from 'express'

export const logger = createLogger('api')
export const app = Express()
export default app

app.use(compression())
app.use(bodyParser.json({strict: true}))

const whitelist = [
  'https://app.protium.dev:3000',
]

const corsOptions = {
  origin (origin: string, callback: (err: Error | null, result?: boolean) => void) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
}

app.use(cors(corsOptions))

app.get('/heartbeat', (req, res) => res.json({alive: true}))
app.get('/', (req, res) => {
  res.json({hello: 'world'})
})
