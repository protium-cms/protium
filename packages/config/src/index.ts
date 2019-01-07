import Path from 'path'
process.env.NODE_CONFIG_DIR = Path.resolve(__dirname, '../base')

import config from 'config'

export const get = config.get
export const has = config.has
export const util = config.util
export default config
