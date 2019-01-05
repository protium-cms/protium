import {createDevMiddleware, createSSRMiddleware} from '@protium/assets/lib/middleware'
import {json} from 'body-parser'
import compression from 'compression'
import Express from 'express'
import Path from 'path'
import resolvePkg from 'resolve-pkg'

const DEVELOPMENT = process.env.NODE_ENV === 'development'

const middlewareOpts = {
  assetsModule: '@protium/assets',
  module: '@protium/app',
}

const assetPath = Path.resolve(resolvePkg(middlewareOpts.assetsModule), 'lib')

export const app = Express()

app.use(compression())
app.use(json({strict: true}))

if (DEVELOPMENT) {
  app.use(createDevMiddleware())
}

app.use('/assets', Express.static(assetPath, {fallthrough: false}))
app.get('/*', createSSRMiddleware())

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
