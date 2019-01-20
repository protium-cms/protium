import Path from 'path'

process.env.NODE_CONFIG_DIR = Path.resolve(__dirname, '../config')

import config from 'config'
export default config
