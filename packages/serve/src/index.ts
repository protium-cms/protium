import './error-handling'

import {api} from '@protium/api'
import config from '@protium/config'
import {app} from '@protium/web'
import {Application} from 'express'
import Fs from 'fs'
import Path from 'path'
import resolvePkg from 'resolve-pkg'
import Spdy, {ServerOptions} from 'spdy'

const packageRoot = resolvePkg('@protium/serve')

start('web', app)
start('api', api)

export function start (type: string, appModule: Application) {
  const env = config.get('env')
  const port = config.get(`${type}.port`)
  const options: ServerOptions = {
    cert: getCertType('app', 'crt'),
    key: getCertType('app', 'key'),
  }

  const server = Spdy.createServer(options, appModule)
  server.listen(port, () => {
    console.log(`[${type}]: listening on port ${port} in ${env} mode`)
  })
}

function getCertType (target: string, type: 'key' | 'crt' | 'pem'): string | undefined {
  const envKey = `${target.toUpperCase()}_${type.toUpperCase()}`
  const envValue = process.env[envKey]

  if (envValue) {
    return envValue
  }

  console.log(`${envKey} not found, looking for .pem file...`)
  const keyName = `${target}.${type === 'key' ? `private.${type}` : type}.pem`
  const keyPath = Path.resolve(packageRoot, 'keys', keyName)
  if (Fs.existsSync(keyPath)) {
    console.log(`Found ${keyName}, using file.`)
    return Fs.readFileSync(keyPath, 'utf8')
  }
}
