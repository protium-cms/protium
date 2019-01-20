const PrettyError = require('pretty-error') // tslint:disable-line

const pe = new PrettyError()

pe.skipNodeFiles()
pe.skipPackage(
  'ts-node-dev',
  'express',
  'body-parser',
  'helmet',
  'webpack-hot-middleware',
  'webpack-dev-middleware',
)

pe.skipPath('internal/modules/cjs/loader.js')
pe.skip((trace: any, lineNumber: any) => {
  if (trace && trace.file && trace.file.indexOf('ts-node-dev-hook') >= 0) {
    return true
  }
  return false
})

export default pe

pe.appendStyle({
  'pretty-error': {
    display: 'block',
    marginLeft: 0,
  },
  'pretty-error > header > colon': {
    display: 'none',
  },
  'pretty-error > header > message': {
    padding: 0,
  },
  'pretty-error > header > title > kind': {
    display: 'none',
  },
})
