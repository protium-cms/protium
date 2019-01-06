import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import Fs from 'fs'
import Path from 'path'
import resolvePkg from 'resolve-pkg'
import Webpack from 'webpack'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import ManifestPlugin from 'webpack-manifest-plugin'
import nodeExternals from 'webpack-node-externals'
import WebpackPwaManifest from 'webpack-pwa-manifest'
import {IAppWebpackConfig} from './middleware'

const APP_PACKAGE = '@protium/app'
const ASSET_PACKAGE = '@protium/assets'
const PRODUCTION = process.env.NODE_ENV === 'production'
enum ConfigTargets {
  Browser = 'browser',
  Server = 'server',
}

const webpackConfig: IAppWebpackConfig[] = [
  config(ConfigTargets.Browser),
  config(ConfigTargets.Server),
]

export = webpackConfig

function config (target: ConfigTargets): IAppWebpackConfig {
  const appContext = resolvePkg(APP_PACKAGE)
  const assetContext = resolvePkg(ASSET_PACKAGE)
  if (!appContext) {
    throw new Error(`Unable to find ${APP_PACKAGE} (${target})`)
  }

  const entryFile = target === ConfigTargets.Browser
    ? './browser' : './index'

  const c: IAppWebpackConfig = {
    context: Path.resolve('../..'),
    devtool: 'source-map',
    entry: {
      [target]: [Path.join(appContext, 'src', entryFile)],
    },
    module: {
      rules: [
        babelRule(appContext, target),
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
      // new Webpack.NormalModuleReplacementPlugin(/react-art/,
      //   Path.resolve(appContext, 'src', 'stubs/react-art.ts')),
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
    stats: 'normal',
  }

  if (target === ConfigTargets.Browser) {
    c.target = 'web'
    c.plugins!.push(
      new ManifestPlugin({fileName: 'browser.manifest.json'}),
      new WebpackPwaManifest({
        background_color: '#ccc',
        crossorigin: 'use-credentials',
        description: 'My progressive universal app',
        fingerprints: false,
        name: 'Protium',
        short_name: 'protium',
        theme_color: '#ccc',
      }),
    )

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
          tsconfig: Path.join(appContext, 'tsconfig.build.json'),
          tslint: Path.resolve('../../tslint.json'),
          workers: ForkTsCheckerWebpackPlugin.ONE_CPU,
        }),
      )
    }
  }

  if (target === ConfigTargets.Server) {
    c.target = 'node'
    c.externals = [nodeExternals({
      modulesDir: '../../node_modules',
    })]
    c.output!.libraryTarget = 'commonjs2'
    c.optimization = {minimize: false}
    c.plugins!.push(
      new ManifestPlugin({fileName: 'server.manifest.json'}),
    )
  }

  return c
}

function babelRule (context: string, target: ConfigTargets): Webpack.Rule {
  const babelConfig = {
    babelrc: false,
    cacheDirectory: true,
    sourceMaps: true,
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
    ] as any[],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: target === ConfigTargets.Server
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
    ] as any[],
  }

  if (target === ConfigTargets.Browser) {
    // babelConfig.presets.push('babel-preset-minify')
    babelConfig.plugins.unshift('babel-plugin-react-native-web')
    if (!PRODUCTION) {
      babelConfig.plugins.push('react-hot-loader/babel')
    }
  }

  return {
    include: context,
    test: /\.(m?j|t)sx?$/,
    use: {
      loader: 'babel-loader',
      options: babelConfig,
    },
  }
}
