import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import Fs from 'fs'
import OfflinePlugin from 'offline-plugin'
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
const PROJECT_ROOT = Path.resolve('../../')
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
    context: Path.join(appContext, 'src'),
    devtool: 'source-map',
    entry: {
      [target]: [entryFile],
    },
    module: {
      rules: [
        babelRule(appContext, target),
      ],
    },
    name: target,
    output: {
      filename: '[name].bundle.js',
      path: Path.join(assetContext, 'lib'),
      devtoolModuleFilenameTemplate (info) {
        let modulePath: string | null = null

        if (info.identifier.startsWith('external ')) {
          const modName = JSON.parse(info.identifier.replace('external ', ''))
          if (modName) {
            modulePath = require.resolve(modName)
          }
        }

        if (!modulePath) {
          modulePath = info.absoluteResourcePath
        }

        return `webpack:///./${Path.relative(PROJECT_ROOT, modulePath)}`
      },
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
    // stats: 'errors-only',
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
        icons: [
          {
            sizes: [32, 64, 128, 256, 512],
            src: Path.join(assetContext, 'images', 'Icon.png'),
          },
        ],
        name: 'Protium',
        short_name: 'protium',
        start_url: '/',
        theme_color: '#ccc',
      }),
      new OfflinePlugin({
        autoUpdate: true,
        publicPath: '/assets/',
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
          // tslint: Path.join('../../tslint.json'),
          workers: ForkTsCheckerWebpackPlugin.ONE_CPU,
        }),
      )
    }
  }

  if (target === ConfigTargets.Server) {
    const modulesDir = Fs.existsSync(Path.resolve('node_modules', 'react'))
      ? Path.resolve('node_modules')
      : Path.resolve('../../node_modules')
    c.target = 'node'
    c.externals = [nodeExternals({
      modulesDir,
      // whitelist: /react-native(?:-web)|style-components\/native/,
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
    sourceMaps: true,
  }

  if (target === ConfigTargets.Browser) {
    babelConfig.plugins.unshift('babel-plugin-react-native-web')
    if (!PRODUCTION) {
      babelConfig.plugins.push('react-hot-loader/babel')
    }
  }

  return {
    include: [
      context,
      // /node_modules\/react-native-web/,
      // /node_modules\/styled-components/,
    ],
    test: /\.(m?j|t)sx?$/,
    use: [
      {
        loader: 'babel-loader',
        options: babelConfig,
      },
    ],
  }
}
