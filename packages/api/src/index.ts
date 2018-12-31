import Express from 'express'

export const api = Express()

api.get('/', (req, res) => {
  res.json({hello: 'world'})
})
