import devMiddleware from '@protium/assets/lib/dev-middleware'
import ssrMiddleware from '@protium/assets/lib/ssr-middleware'
import {json} from 'body-parser'
import compression from 'compression'
import Express from 'express'

const DEVELOPMENT = process.env.NODE_ENV === 'development'

export const app = Express()

app.use(compression())
app.use(json({strict: true}))

if (DEVELOPMENT) {
  app.use(devMiddleware())
}

app.get('/*', ssrMiddleware())
app.get('/', (req, res) => {
  res.send(`
    <style>
      html, body, #app-container {
        height: 100%;
      }
    </style>
    <div id="app-container"></div>
    <script src="/assets/browser.bundle.js"></script>
  `)
})
