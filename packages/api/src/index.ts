import bodyParser from 'body-parser'
import compression from 'compression'
import Express from 'express'

export const api = Express()

api.use(compression())
api.use(bodyParser.json({strict: true}))

api.get('/', (req, res) => {
  res.json({hello: 'world'})
})
