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
    ? '@protium/app/src/index.web.ts'
    : '@protium/app/src/App.tsx'

  const c: IAppWebpackConfig = {
    context: Path.resolve(__dirname, '..'),
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
      new Webpack.NormalModuleReplacementPlugin(/react-art/,
        Path.resolve(appContext, 'src', 'stubs/react-art.ts')),
      new Webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
    ],
    resolve: {
      alias: {
        'react-native': 'react-native-web',
      },
      extensions: [
        '.web.tsx',
        '.tsx',
        '.web.ts',
        '.ts',
        '.web.jsx',
        '.jsx',
        '.web.mjs',
        '.mjs',
        '.web.node',
        '.node',
        '.web.js',
        '.js',
      ],
      symlinks: false,
    },
    // stats: 'minimal',
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
    )

    if (PRODUCTION) {
      c.plugins!.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          generateStatsFile: true,
          openAnalyzer: false,
        }),
        new OfflinePlugin({
          ServiceWorker: {
            minify: true,
            publicPath: '/sw.js',
            scope: '/',
          },
          appShell: '/',
          autoUpdate: true,
          externals: [
            '/',
            '/favicon.ico',
            '/sw.js',
          ],
          prefetchRequest: {
            credentials: 'include',
            mode: 'same-origin',
          },
          publicPath: '/assets/',
          relativePaths: false,
        }),
      )
    } else {
      c.plugins!.unshift(
        new ForkTsCheckerWebpackPlugin({
          async: true,
          tsconfig: Path.join(appContext, 'tsconfig.build.json'),
          workers: ForkTsCheckerWebpackPlugin.ONE_CPU,
        }),
      )
    }
  }

  if (target === ConfigTargets.Server) {
    c.devtool = 'cheap-eval-source-map'
    c.target = 'node'
    c.externals = module.paths.map((p) => {
      return nodeExternals({
        modulesDir: p,
        whitelist: /@protium\/app|@babel\/runtime/,
      })
    })
    c.output!.libraryTarget = 'commonjs2'
    c.optimization = {
      concatenateModules: false,
      minimize: false,
    }
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
      /node_modules\/@protium\/app/,
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
