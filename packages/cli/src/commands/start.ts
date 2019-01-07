import {Arguments, Argv} from 'yargs'

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
    require('@protium/serve')
  },
}
