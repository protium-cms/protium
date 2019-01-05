import Fs from 'fs'
import Path from 'path'
import Webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import nodeExternals from 'webpack-node-externals'
import {IAppWebpackConfig} from './middleware'
import {getContext} from './utils'

const APP_PACKAGE = '@protium/app'

const webpackConfig: IAppWebpackConfig[] = [
  config('browser'),
  config('server'),
]

export = webpackConfig

function config (target: 'browser' | 'server'): IAppWebpackConfig {
  const packageContext = getContext(APP_PACKAGE)
  if (!packageContext) {
    throw new Error(`Unable to find ${APP_PACKAGE} (${target})`)
  }

  const moduleContext = Fs.realpathSync(Path.resolve(packageContext))
  const entryFile = target === 'browser'
    ? './browser' : './index'

  const c: IAppWebpackConfig = {
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
      path: Path.resolve('lib'),
    },
    performance: {
      hints: false,
    },
    plugins: [
      new Webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
    ],
    resolve: {
      alias: {
        'react-native': 'react-native-web',
      },
      extensions: ['.tsx', '.ts', '.js'],
    },
  }

  if (target === 'server') {
    c.target = 'node'
    c.externals = [nodeExternals()]
    c.output!.libraryTarget = 'commonjs2'
    c.plugins!.push(
      new ManifestPlugin(),
    )
  }

  return c
}
