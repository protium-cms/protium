import Path from 'path'
import resolvePkg from 'resolve-pkg'
import {Arguments, Argv} from 'yargs'
const tsNodeDev = require('ts-node-dev') // tslint:disable-line

export default {
  aliases: 'd',
  builder: (yargs: Argv<{}>) => yargs
    .usage('Usage: $0 dev <app>')
    .positional('app', {
      choices: ['web', 'api', 'combined'],
      type: 'string',
    })
  ,
  command: 'dev',
  handler (args: Arguments<{}>) {
    devServer()
  },
}

const compat = [
  'module-alias/register',
  'tsconfig-paths/register',
].reduce((m, mod) => {
  m.push('-r', mod)
  return m
}, [] as string[])

export function devServer (extra: string[] = []) {
  const script = Path.join(resolvePkg('@protium/serve'), 'src/index.ts')

  const scriptArgs = [
    '--prefer-ts',
    '--pretty',
  ]

  const nodeArgs = [
    ...compat,
    ...extra,
  ]

  return tsNodeDev(script, scriptArgs, nodeArgs, {
    dedupe: true,
    deps: 0,
    fork: false,
    ignore: [
      'server.bundle.js',
      'manifest.json',
    ],
    notify: false,
  })
}
