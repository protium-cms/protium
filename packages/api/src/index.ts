import Express from 'express'

const app = Express()
export default app

app.get('/', (req, res) => {
  res.json({hello: 'world'})
})
