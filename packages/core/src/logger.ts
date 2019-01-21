import chalk from 'chalk'
import {format} from 'logform'
import Winston from 'winston'
import config from './config'
import error from './error-renderer'

const {combine, printf, colorize, label} = format
const {Console} = Winston.transports

const consoleTransport = new Console()
const colorFormatter = colorize({
  colors: {
    debug: 'magenta',
    error: 'red',
    info: 'blue',
    log: 'white',
    silly: 'gray',
    warn: 'yellow',
  },
})

const errors = format((info) => {
  if (info instanceof Error) {
    info.message = error.render(info) as string
  }

  if (info.message as any instanceof Error) {
    info.message = error.render(info.message) as string
  }

  return info
})

const simpleFormatter = printf((info) => {
  const label = info.label && info.label.length
    ? chalk.dim(`[${info.label}]`)
    : ''
  const msg = `${info.level}: ${label} ${info.message}`
  return msg
})

export function createLogger (type: string = '') {
  return Winston.createLogger({
    format: combine(
      errors(),
      colorFormatter,
      label({label: type}),
      simpleFormatter,
    ),
    level: config.get('logLevel'),
    transports: [
      consoleTransport,
    ],
  })
}

export const logger = createLogger()
export default logger
