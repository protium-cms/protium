import {fork, spawn, spawnSync} from 'child_process'
import Path from 'path'
import resolvePkg from 'resolve-pkg'
import {Arguments, Argv} from 'yargs'

const packagePath = resolvePkg('@protium/serve')
const tsNodeDev = resolvePkg('ts-node-dev')
const modPath = Path.join(tsNodeDev, 'bin', 'ts-node-dev')

const compat = [
  'module-alias/register',
  'tsconfig-paths/register',
].reduce((m, mod) => {
  m.push('-r', mod)
  return m
}, [] as string[])

const ignore = [
  'server.bundle.js',
  'manifest.json',
].reduce((m, file) => {
  m.push('--ignore-watch', file)
  return m
}, [] as string[])

export const devCmd = [
  modPath,
  ...compat,
  ...ignore,
  '--no-notify',
  '--dedupe',
  '--prefer-ts',
  '--pretty',
  'src/index.ts',
]

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
    const [cmd, ...cmdArgs] = devCmd
    return fork(cmd, cmdArgs, {
      cwd: packagePath,
      // detached: true,
      stdio: 'inherit',
    })
  },
}
