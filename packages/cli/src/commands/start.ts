import {fork, spawnSync} from 'child_process'
import resolvePkg from 'resolve-pkg'
import {Arguments, Argv} from 'yargs'

const packagePath = resolvePkg('@protium/serve')
const packageMeta = require('@protium/serve/package.json') // tslint:disable-line
const startCmd: string[] = packageMeta.scripts.start.split(' ')

export default {
  aliases: 's',
  builder: (yargs: Argv<{}>) => yargs
    .usage('Usage: $0 start <app>')
    .positional('app', {
      choices: ['web', 'api', 'combined'],
      type: 'string',
    })
  ,
  command: 'start',
  handler (args: Arguments<{}>) {
    const [env, cmd, ...cmdArgs] = startCmd
    fork(packageMeta.main, undefined, {
      cwd: packagePath,
      env: {NODE_ENV: 'production'},
    })
  },
}
