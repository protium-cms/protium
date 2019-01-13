import {spawnSync} from 'child_process'
import resolvePkg from 'resolve-pkg'
import {Arguments, Argv} from 'yargs'

const packagePath = resolvePkg('@protium/serve')
const packageMeta = require('@protium/serve/package.json') // tslint:disable-line
export const devCmd: string[] = packageMeta.scripts.dev.split(' ')

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
    spawnSync(cmd, cmdArgs, {
      cwd: packagePath,
      stdio: 'inherit',
    })
  },
}
