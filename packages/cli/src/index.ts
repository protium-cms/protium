import Chalk from 'chalk'
import Yargs from 'yargs'

import debug from './commands/debug'
import dev from './commands/dev'
import start from './commands/start'

const logo = `                  __  _
   ___  _______  / /_(_)_ ____ _
  / _ \\/ __/ _ \\/ __/ / // /  ' \\
 / .__/_/  \\___/\\__/_/\\_,_/_/_/_/
/_/`

const description = 'A CLI for interacting with the Protium library'
const entry = `${Chalk.green(logo)}\n`

console.log(entry)
const program = Yargs
  .scriptName(Chalk.bold('protium'))
  .usage('Usage: $0 <command> [options]')
  .command(debug)
  .command(dev)
  .command(start)
  .help('help', 'Show help')
  .showHelpOnFail(true)
  .alias('h', 'help')
  .demandCommand(1)
  .argv
