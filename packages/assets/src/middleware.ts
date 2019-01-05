import {NextFunction, Request, Response} from 'express'
import Path from 'path'
import React from 'react'
import {renderToStaticNodeStream} from 'react-dom/server'
import {AppRegistry} from 'react-native-web'
import resolvePkg from 'resolve-pkg'
import Webpack, {Configuration} from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import Html from './components/Html'
import assetConfig from './webpack'

const DEVELOPMENT = process.env.NODE_ENV === 'development'

export interface IAppWebpackConfig extends Configuration {
  entry: {[key: string]: string[]}
}

export interface IWebpackMiddlewareOptions {
  assetsModule: string
  browserBundleName?: string
  module: string
  moduleExport: string
  publicPath?: string
  serverBundleName?: string
}

const defaultOpts = {
  assetsModule: '@protium/assets',
  browserBundleName: 'browser',
  module: '@protium/app',
  moduleExport: 'App',
  publicPath: '/assets/',
  serverBundleName: 'server',
}

export function createSSRMiddleware (options: IWebpackMiddlewareOptions = defaultOpts) {
  const opts = {...defaultOpts, ...options}
  const context = resolvePkg(opts.assetsModule)

  if (!context) {
    throw new Error(`Unable to determine module context: ${context}`)
  }

  const moduleDirectory = Path.resolve(context, 'lib')
  const manifestPath = Path.join(moduleDirectory, 'manifest.json')

  return [
    resolverMiddleware,
    renderMiddleware,
  ]

  function resolverMiddleware (req: Request, res: Response, next: NextFunction) {
    const manifest = require(manifestPath)
    const serverEntry = manifest[opts.serverBundleName + '.js']

    if (!serverEntry) {
      throw new Error(`Unable to determine server entrypoint: ${serverEntry}`)
    }

    res.locals.appEntrypoint = Path.join(moduleDirectory, serverEntry)
    if (DEVELOPMENT) {
      console.log(`[assets]: clear ${res.locals.appEntrypoint}`)
      delete require.cache[res.locals.appEntrypoint]
    }

    const mod = require(res.locals.appEntrypoint)
    if (!mod) {
      throw new Error(`Unable to require server entrypoint: ${mod}`)
    }

    const app = mod[opts.moduleExport || 'default']
    if (!app) {
      throw new Error(`Unable to find app`)
    }

    res.locals.app = app
    res.locals.appName = 'App'
    AppRegistry.registerComponent(res.locals.appName, () => app)

    next()
  }

  function renderMiddleware (req: Request, res: Response, next: NextFunction) {
    const appName: string = res.locals.appName
    const appInstance = React.createElement(Html, {appName})
    const appStream = renderToStaticNodeStream(appInstance)
    return appStream.pipe(res)
  }
}

export function createDevMiddleware (options: IWebpackMiddlewareOptions = defaultOpts) {
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

function findEntry (config: IAppWebpackConfig, entrypoint: string) {
  return Object.keys(config.entry!).find((eKey: string) => {
    return eKey === entrypoint
  }) as string
}
