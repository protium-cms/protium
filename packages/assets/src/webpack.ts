import Fs from 'fs'
import Path from 'path'
import Webpack from 'webpack'
import {getContext} from './utils'

const APP_PACKAGE = '@protium/app'

const webpackConfig: Webpack.Configuration[] = [
  config('browser'),
]

export = webpackConfig

function config (target: 'browser' | 'server'): Webpack.Configuration {
  const packageContext = getContext(APP_PACKAGE)
  if (!packageContext) {
    throw new Error(`Unable to find ${APP_PACKAGE}`)
  }

  const moduleContext = Fs.realpathSync(Path.resolve(packageContext))
  const entryFile = target === 'browser'
    ? './browser' : './index'

  const c: Webpack.Configuration = {
    context: Path.join(moduleContext, 'src'),
    devtool: 'source-map',
    entry: {
      [target]: [entryFile],
    },
    module: {
      rules: [
        {
          include: moduleContext,
          loader: 'ts-loader',
          options: {
            configFile: Path.join(moduleContext, 'tsconfig.build.json'),
            transpileOnly: true,
          },
          test: /\.tsx?$/,
        },
      ],
    },
    name: target,
    output: {
      filename: '[name].bundle.js',
      path: Path.resolve('dist'),
    },
    performance: {
      hints: false,
    },
    plugins: [
      new Webpack.DefinePlugin({
        NODE_ENV: JSON.stringify('production'),
      }),
    ],
    resolve: {
      alias: {
        'react-native': 'react-native-web',
      },
      extensions: ['.ts', '.tsx', '.js'],
      symlinks: true,
    },
  }

  return c
}
