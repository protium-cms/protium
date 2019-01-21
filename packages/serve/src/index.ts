process.title = 'protium-server'

import './error-handling'

import {config} from '@protium/core'
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
  const {default: app, logger} = require(`@protium/${type}`)

  const options: ServerOptions = {
    cert: getCertType('app', 'crt', logger),
    key: getCertType('app', 'key', logger),
  }

  const server = Spdy.createServer(options, app)
  server.listen(port, () => {
    logger.info(`listening on port ${port} in ${env} mode`)
  })
}

function getCertType (target: string, type: 'key' | 'crt' | 'pem', log: typeof logger): string | undefined {
  const envKey = `${target.toUpperCase()}_${type.toUpperCase()}`
  const envValue = process.env[envKey]

  if (envValue) {
    return envValue
  }

  log.debug(`${envKey} not found, looking for .pem file...`)
  const keyName = `${target}.${type === 'key' ? `private.${type}` : type}.pem`
  const keyPath = Path.resolve(packageRoot, 'keys', keyName)
  if (Fs.existsSync(keyPath)) {
    log.debug(`Found ${keyName}, using file.`)
    return Fs.readFileSync(keyPath, 'utf8')
  }
}
