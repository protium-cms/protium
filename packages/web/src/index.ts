import {createDevMiddleware, createSSRMiddleware} from '@protium/assets/lib/middleware'
import {config} from '@protium/core'
import {json} from 'body-parser'
import compression from 'compression'
import Express from 'express'
import helmet from 'helmet'
import Path from 'path'
import resolvePkg from 'resolve-pkg'
import favicon from 'serve-favicon'
import errorHandler from './middleware/error-handler'

const DEVELOPMENT = process.env.NODE_ENV === 'development'
// const APP_MODULE = '@protium/app'
const ASSET_MODULE = '@protium/assets'
// const WEB_MODULE = '@protium/web'

const assetModule = resolvePkg(ASSET_MODULE)
export const app = Express()

app.use(helmet())
app.use(compression())
app.use(json({strict: true}))

app.use((req, res, next) => {
  Math.random() > 0.5 ? next(new Error('random error')) : next()
})

if (config.get('env') === 'development') {
  app.use(createDevMiddleware())
}

app.use(favicon(Path.join(assetModule, 'images', 'icon_29pt.png')))

app.get('/robots.txt', (req, res) => res.send(`
  User-agent: *
  Disallow:
`))

app.use('/assets', Express.static(
  Path.join(assetModule, 'lib'),
  {
    fallthrough: false,
    setHeaders (res) {
      res.setHeader('Cache-Control', 'public,max-age=31536000,immutable')
    },
  },
))

app.use('/*', createSSRMiddleware())
app.use(errorHandler)

export default app
