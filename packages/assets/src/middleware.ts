import {NextFunction, Request, Response} from 'express'
import Webpack, {Configuration} from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import assetConfig from './webpack'

export interface IAppWebpackConfig extends Configuration {
  entry: {[key: string]: string[]}
}

export interface IDevMiddlewareOpts {
  browserBundleName?: string
  module: string
  publicPath?: string
  serverBundleName?: string
}

const defaultOpts = {
  browserBundleName: 'browser',
  module: '@protium/app',
  publicPath: '/assets/',
  serverBundleName: 'server',
}

export function createDevMiddleware (options: IDevMiddlewareOpts = defaultOpts) {
  const opts = {...defaultOpts, ...options}
  const browserConfig = assetConfig.find((c: Webpack.Configuration) => {
    return c.name === opts.browserBundleName
  })

  if (!browserConfig) {
    throw new Error(`Unable to find browser webpack config: ${opts.browserBundleName}`)
  }

  const serverConfig = assetConfig.find((c: Webpack.Configuration) => {
    return c.name === opts.serverBundleName
  })

  if (!serverConfig) {
    throw new Error(`Unable to find browser webpack config: ${opts.serverBundleName}`)
  }

  const browserCompiler = buildBrowserCompiler(browserConfig, opts.browserBundleName, opts.publicPath)
  const serverCompiler = buildServerCompiler(serverConfig, opts.serverBundleName)

  return [
    WebpackDevMiddleware(serverCompiler, {
      logLevel: 'warn',
      publicPath: opts.publicPath,
      serverSideRender: true,
      writeToDisk: true,
    }),
    WebpackDevMiddleware(browserCompiler, {
      logLevel: 'warn',
      publicPath: opts.publicPath,
    }),
    WebpackHotMiddleware(browserCompiler),
  ]
}

function buildBrowserCompiler (config: IAppWebpackConfig, entrypoint: string, publicPath: string) {
  config.mode = 'development'
  config.output!.publicPath = publicPath

  const browserEntry = findEntry(config, entrypoint)

  if (!browserEntry) {
    throw new Error(`Unable to find browser webpack entrypoint: ${entrypoint}`)
  }

  config.entry[browserEntry].unshift(
    `webpack-hot-middleware/client`,
  )

  config.plugins!.push(new Webpack.HotModuleReplacementPlugin())
  return Webpack(config)
}

function buildServerCompiler (config: IAppWebpackConfig, entrypoint: string) {
  config.mode = 'development'

  const serverEntry = findEntry(config, entrypoint)

  if (!serverEntry) {
    throw new Error(`Unable to find browser webpack entrypoint: ${entrypoint}`)
  }

  return Webpack(config)
}

export function createSSRMiddleware (options: IDevMiddlewareOpts = defaultOpts) {
  const opts = {...defaultOpts, ...options}
  // const opts.serverBundleName
  return [
    resolverMiddleware,
    renderMiddleware,
  ]
}

function resolverMiddleware (req: Request, res: Response, next: NextFunction) {
  next()
}

function renderMiddleware (req: Request, res: Response, next: NextFunction) {
  next()
}

function findEntry (config: IAppWebpackConfig, entrypoint: string) {
  return Object.keys(config.entry!).find((eKey: string) => {
    return eKey === entrypoint
  }) as string
}
