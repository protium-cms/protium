import {config} from '@protium/core'
import Knex from 'knex'

export default Knex({
  ...config.get('db'),
})
