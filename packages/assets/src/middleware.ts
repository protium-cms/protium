import {NextFunction, Request, Response} from 'express'
import moduleAlias from 'module-alias'
import Path from 'path'
import React from 'react'
import {renderToStaticNodeStream} from 'react-dom/server'
import {AppRegistry} from 'react-native-web'
import resolvePkg from 'resolve-pkg'
import Webpack, {Configuration} from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import Html from './components/Html'
import logger from './logger'
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

export function createSSRMiddleware (options: IWebpackMiddlewareOptions = defaultOpts) {
  const opts = {...defaultOpts, ...options}
  const context = resolvePkg(opts.assetsModule)

  if (!context) {
    throw new Error(`Unable to determine module context: ${context}`)
  }

  const moduleDirectory = Path.resolve(context, 'lib')
  const manifestPath = Path.join(moduleDirectory, 'server.manifest.json')

  return [
    resolverMiddleware,
    renderMiddleware,
  ]

  function resolverMiddleware (req: Request, res: Response, next: NextFunction) {
    const manifest = require(manifestPath)
    const serverEntry = manifest[opts.serverBundleName + '.js']

    // We alias react-native -> react-native-web here
    // So SSR renderer will call that instead
    // This will probably break once we start using real code...
    moduleAlias.addAlias('react-native', 'react-native-web')

    if (!serverEntry) {
      throw new Error(`Unable to determine server entrypoint: ${serverEntry}`)
    }

    res.locals.appEntrypoint = Path.join(moduleDirectory, serverEntry)
    if (DEVELOPMENT) {
      logger.debug(`removing ${Path.relative(process.cwd(), res.locals.appEntrypoint)} from cache...`)
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
    res.status(200)
    res.type('html')
    res.write(`<!doctype html>`)
    return appStream.pipe(res)
  }
}

function buildBrowserCompiler (config: IAppWebpackConfig, entrypoint: string, publicPath: string) {
  config.mode = 'development'
  config.output!.publicPath = publicPath

  const browserEntry = findEntry(config, entrypoint)

  if (!browserEntry) {
    throw new Error(`Unable to find browser webpack entrypoint: ${entrypoint}`)
  }

  config.entry[browserEntry].unshift(
    `webpack-hot-middleware/client?timeout=10000&reload=true`,
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
