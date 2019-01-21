import {fork, ForkOptions} from 'child_process'
import Path from 'path'
import resolvePkg from 'resolve-pkg'
import {Arguments, Argv, CommandModule} from 'yargs'
import {devServer} from './dev'

interface IDebugCommand {
  inspect: string
  inspectBrk: string
}

export default {
  aliases: 'd',
  builder: (yargs: Argv<any>) => yargs
    .usage('Usage: $0 debug <app>')
    .option('inspect', {
      default: true,
      type: 'boolean',
    })
    .positional('app', {
      choices: ['web', 'api', 'combined'],
      type: 'string',
    })
  ,
  command: 'debug',
  handler (args: Arguments<any>) {
    const nodeArgs = []

    if (args.inspect) {
      nodeArgs.push('--inspect')
    }

    if (args.inspectBrk) {
      nodeArgs.push(`--inspect-brk=${args.inspectBrk}`)
    }

    devServer(nodeArgs)
  },
}
