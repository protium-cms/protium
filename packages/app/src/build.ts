import Webpack from 'webpack'

export = [
  config('browser'),
] as Webpack.Configuration[]

function config (target: 'browser' | 'server') {
  const c = {}

  return c
}
