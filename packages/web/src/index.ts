import devMiddleware from '@protium/assets/lib/dev-middleware'
import bodyParser from 'body-parser'
import compression from 'compression'
import Express from 'express'

const DEVELOPMENT = process.env.NODE_ENV === 'development'

export const app = Express()

app.use(compression())
app.use(bodyParser.json({strict: true}))

if (DEVELOPMENT) {
  app.use(devMiddleware())
}

app.get('/', (req, res) => {
  res.send(`
    <div id="app-container"></div>
    <script src="/assets/browser.bundle.js"></script>
  `)
})
