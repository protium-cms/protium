import {fork, ForkOptions} from 'child_process'
import Path from 'path'
import resolvePkg from 'resolve-pkg'
import {Arguments, Argv, CommandModule} from 'yargs'
import {devCmd} from './dev'

const packagePath = resolvePkg('@protium/serve')

interface IDebugCommand {
  inspect: string
  inspectBrk: string
}

export default {
  aliases: 'd',
  builder: (yargs: Argv<any>) => yargs
    .usage('Usage: $0 debug <app>')
    .positional('app', {
      choices: ['web', 'api', 'combined'],
      type: 'string',
    })
  ,
  command: 'debug',
  handler (args: Arguments<any>) {
    const [cmd, ...cmdArgs] = devCmd
    const entry = cmdArgs.pop() as string

    if (args.inspect) {
      cmdArgs.push('--inspect')
    }

    if (args.inspectBrk) {
      cmdArgs.push(`--inspect-brk=${args.inspectBrk}`)
    }

    cmdArgs.push(entry)

    const nodeOpts: ForkOptions = {
      cwd: packagePath,
      stdio: 'inherit',
    }

    fork(cmd, cmdArgs, nodeOpts)
  },
}
