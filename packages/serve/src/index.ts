import {api} from '@protium/api'
import {app} from '@protium/web'
import Fs from 'fs'
import Path from 'path'
import Spdy, {ServerOptions} from 'spdy'

const port = process.env.PORT || 3000
const apiPort = process.env.API_PORT || 3001

const options: ServerOptions = {
  // ca: getCertType('rootCA', 'crt'),
  cert: getCertType('app', 'crt'),
  key: getCertType('app', 'key'),
}

Spdy.createServer(options, app).listen(port, () => {
  console.log(`[web] listening on port ${port}`)
})

Spdy.createServer(options, api).listen(apiPort, () => {
  console.log(`[api] listening on port ${apiPort}`)
})

function getCertType (target: string, type: 'key' | 'crt' | 'pem'): string | undefined {
  const envKey = `${target.toUpperCase()}_${type.toUpperCase()}`
  const envValue = process.env[envKey]

  if (envValue) {
    return envValue
  }

  console.log(`${envKey} not found, looking for .pem file...`)
  const keyName = `${target}.${type === 'key' ? `private.${type}` : type}.pem`
  const keyPath = Path.resolve('keys', keyName)
  if (Fs.existsSync(keyPath)) {
    console.log(`Found ${keyName}, using file.`)
    return Fs.readFileSync(keyPath, 'utf8')
  }
}
