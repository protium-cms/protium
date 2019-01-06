import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import Fs from 'fs'
import Path from 'path'
import resolvePkg from 'resolve-pkg'
import Webpack from 'webpack'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import ManifestPlugin from 'webpack-manifest-plugin'
import nodeExternals from 'webpack-node-externals'
import {IAppWebpackConfig} from './middleware'

const APP_PACKAGE = '@protium/app'
const ASSET_PACKAGE = '@protium/assets'
const PRODUCTION = process.env.NODE_ENV === 'production'

const webpackConfig: IAppWebpackConfig[] = [
  config('browser'),
  config('server'),
]

export = webpackConfig

type ConfigTargets = 'browser' | 'server'

function config (target: ConfigTargets): IAppWebpackConfig {
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
        babelRule(moduleContext, target),
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
      new Webpack.IgnorePlugin(/react-art/),
      new Webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
    ],
    resolve: {
      alias: {
        'react-native': 'react-native-web',
      },
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    stats: 'minimal',
  }

  if (target === 'browser') {
    c.target = 'web'
    if (PRODUCTION) {
      c.plugins!.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        generateStatsFile: true,
        openAnalyzer: false,
      }))
    } else {
      c.plugins!.unshift(
        new ForkTsCheckerWebpackPlugin({
          async: true,
          tsconfig: Path.join(moduleContext, 'tsconfig.build.json'),
          tslint: Path.resolve('../../tslint.json'),
          workers: ForkTsCheckerWebpackPlugin.ONE_CPU,
        }),
      )
    }
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

function babelRule (context: string, target: ConfigTargets): Webpack.Rule {
  const babelConfig = {
    babelrc: false,
    cacheDirectory: true,
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          // "corejs": false,
          // "helpers": true,
          // "regenerator": true,
          useESModules: true,
        },
      ],
      ['@babel/plugin-proposal-decorators', {legacy: true}],
      ['@babel/plugin-proposal-class-properties', {loose: true}],
      'react-hot-loader/babel',
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: target === 'server'
            ? {
              esmodules: false,
              node: 'current',
            }
            : {
              esmodules: true,
            },
        },
      ],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ],
  }

  // if (PRODUCTION) {
  //   babelConfig.presets.push('babel-preset-minify')
  // }

  return {
    include: context,
    test: /\.(m?j|t)sx?$/,
    use: {
      loader: 'babel-loader',
      options: babelConfig,
    },
  }
}
