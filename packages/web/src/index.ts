import devMiddleware from '@protium/assets/lib/dev-middleware'
import {getContext} from '@protium/assets/lib/utils'
import bodyParser from 'body-parser'
import compression from 'compression'
import Express from 'express'
import Path from 'path'

const PRODUCTION = process.env.NODE_ENV === 'production'
export const app = Express()

app.use(compression())
app.use(bodyParser.json({strict: true}))

if (!PRODUCTION) {
  app.use(devMiddleware({publicPath: '/assets'}))
}

app.get('/', (req, res) => {
  res.send(`
    <div id="app-container"></div>
    <script src="/assets/browser.bundle.js"></script>
  `)
})
