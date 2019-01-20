import {format} from 'logform'
import Winston from 'winston'
import error from './error-renderer'
const {combine, printf, colorize} = format
const {Console} = Winston.transports

const consoleTransport = new Console()
const colorFormatter = colorize({
  colors: {
    debug: 'green',
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
  const msg = `${info.level}: ${info.message}`
  return msg
})

const logger = Winston.createLogger({
  format: combine(
    errors(),
    colorFormatter,
    simpleFormatter,
  ),
  level: 'info',
  transports: [
    consoleTransport,
  ],
})

export default logger
