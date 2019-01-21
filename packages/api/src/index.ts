import {createLogger} from '@protium/core'
import bodyParser from 'body-parser'
import compression from 'compression'
import Express from 'express'
// import db from './db'

export const logger = createLogger('api')
export const app = Express()
export default app

app.use(compression())
app.use(bodyParser.json({strict: true}))

app.get('/', (req, res) => {
  res.json({hello: 'world'})
})
