import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import Fs from 'fs'
import Path from 'path'
import resolvePkg from 'resolve-pkg'
import Webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
import nodeExternals from 'webpack-node-externals'
import {IAppWebpackConfig} from './middleware'

const APP_PACKAGE = '@protium/app'
const ASSET_PACKAGE = '@protium/assets'

const webpackConfig: IAppWebpackConfig[] = [
  config('browser'),
  config('server'),
]

export = webpackConfig

function config (target: 'browser' | 'server'): IAppWebpackConfig {
  const packageContext = resolvePkg(APP_PACKAGE)
  const assetContext = resolvePkg(ASSET_PACKAGE)
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
        babelRule(moduleContext),
      ],
    },
    name: target,
    output: {
      filename: '[name].bundle.js',
      path: Path.resolve(assetContext, 'lib'),
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

  if (target === 'browser') {
    c.plugins!.unshift(
      new ForkTsCheckerWebpackPlugin({
        async: true,
        tsconfig: Path.join(moduleContext, 'tsconfig.json'),
        tslint: Path.resolve('../../tslint.json'),
        workers: ForkTsCheckerWebpackPlugin.ONE_CPU,
      }),
    )
  }

  if (target === 'server') {
    c.target = 'node'
    c.externals = [nodeExternals({
      modulesDir: '../../node_modules',
    })]
    c.output!.libraryTarget = 'commonjs2'
    c.optimization = {minimize: false}
    c.plugins!.push(
      new ManifestPlugin(),
    )
  }

  return c
}

function babelRule (context: string): Webpack.Rule {
  return {
    include: context,
    test: /\.(j|t)sx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        cacheDirectory: true,
        plugins: [
          ['@babel/plugin-proposal-decorators', {legacy: true}],
          ['@babel/plugin-proposal-class-properties', {loose: true}],
          'react-hot-loader/babel',
        ],
        presets: [
          [
            '@babel/preset-env',
            {targets: {browsers: 'last 2 versions'}},
          ],
          '@babel/preset-typescript',
          '@babel/preset-react',
        ],
      },
    },
  }
}
