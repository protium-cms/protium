import {createDevMiddleware, createSSRMiddleware} from '@protium/assets/lib/middleware'
import {config, createLogger} from '@protium/core'
import {json} from 'body-parser'
import compression from 'compression'
import Express, {Request, Response} from 'express'
import helmet from 'helmet'
import Path from 'path'
import resolvePkg from 'resolve-pkg'
import favicon from 'serve-favicon'
import errorHandler from './middleware/error-handler'

const responseTime = require('response-time') // tslint:disable-line

const DEVELOPMENT = config.get('env') === 'development'
// const APP_MODULE = '@protium/app'
const ASSET_MODULE = '@protium/assets'
// const WEB_MODULE = '@protium/web'

const assetModule = resolvePkg(ASSET_MODULE)
export const app = Express()
export const logger = createLogger('web')
app.use(responseTime((req: Request, res: Response, time: number) => {
  logger.debug(`${req.method.toUpperCase()} ${req.originalUrl} - ${time.toFixed(2)} ms`)
}))

app.use(helmet())
app.use(compression())
app.use(json({strict: true}))

if (config.get('env') === 'development') {
  app.use(createDevMiddleware())
}

const favIconPath = DEVELOPMENT
  ? Path.join(assetModule, 'images', 'icon_29pt.png')
  : Path.join(assetModule, 'lib', 'icon_64x64.png')

app.use(favicon(favIconPath))

app.get('/sw.js', (req, res) => res.sendFile(Path.join(assetModule, 'lib', 'sw.js')))

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
