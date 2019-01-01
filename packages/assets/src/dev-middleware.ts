import Webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'

import assetConfig from './webpack'

export interface IDevMiddlewareOpts {
  browserBundleName?: string
  publicPath: string
}

const defaultOpts = {
  browserBundleName: 'browser',
  publicPath: '/assets/',
}

export default function createDevMiddleware (options: IDevMiddlewareOpts = defaultOpts) {
  const opts = {...defaultOpts, ...options}
  const browserConfig = assetConfig.find((c: Webpack.Configuration) => {
    return c.name === opts.browserBundleName
  })

  if (!browserConfig) {
    throw new Error(`Unable to find browser webpack config: ${opts.browserBundleName}`)
  }

  browserConfig.mode = 'development'
  browserConfig.output!.publicPath = opts.publicPath
  const browserEntry = Object.keys(browserConfig.entry!).find((eKey: string) => {
    return eKey === opts.browserBundleName
  }) as string

  if (!browserEntry) {
    throw new Error(`Unable to find browser webpack entrypoint: ${opts.browserBundleName}`)
  }

  browserConfig.entry[browserEntry].unshift(
    `webpack-hot-middleware/client`,
  )

  browserConfig.plugins!.push(new Webpack.HotModuleReplacementPlugin())
  const browserCompiler = Webpack(browserConfig)

  return [
    WebpackDevMiddleware(browserCompiler, {
      lazy: false,
      logLevel: 'warn',
      publicPath: opts.publicPath,
    }),
    WebpackHotMiddleware(browserCompiler),
  ]
}
