import './error-handling'

import {config, logger} from '@protium/core'
import {Application} from 'express'
import Fs from 'fs'
import Path from 'path'
import resolvePkg from 'resolve-pkg'
import Spdy, {ServerOptions} from 'spdy'

const packageRoot = resolvePkg('@protium/serve')

start('web')
start('api')

export function start (type: string) {
  const env = config.get('env')
  const port = config.get(`${type}.port`)
  const mod = require(`@protium/${type}`).default as Application

  const options: ServerOptions = {
    cert: getCertType('app', 'crt'),
    key: getCertType('app', 'key'),
  }

  const server = Spdy.createServer(options, mod)
  server.listen(port, () => {
    logger.info(`[${type}]: listening on port ${port} in ${env} mode`)
  })
}

function getCertType (target: string, type: 'key' | 'crt' | 'pem'): string | undefined {
  const envKey = `${target.toUpperCase()}_${type.toUpperCase()}`
  const envValue = process.env[envKey]

  if (envValue) {
    return envValue
  }

  logger.silly(`${envKey} not found, looking for .pem file...`)
  const keyName = `${target}.${type === 'key' ? `private.${type}` : type}.pem`
  const keyPath = Path.resolve(packageRoot, 'keys', keyName)
  if (Fs.existsSync(keyPath)) {
    logger.silly(`Found ${keyName}, using file.`)
    return Fs.readFileSync(keyPath, 'utf8')
  }
}
