import {fork} from 'child_process'
import Path from 'path'
import resolvePkg from 'resolve-pkg'
import {Arguments, Argv} from 'yargs'

const packagePath = resolvePkg('@protium/serve')
const packageMeta = require('@protium/serve/package.json') // tslint:disable-line
console.log(packagePath)
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
    fork(
      Path.resolve(packagePath, packageMeta.main),
      ['-r', 'module-alias/register'],
      {cwd: packagePath, env: {NODE_ENV: 'production'}},
    )
  },
}
