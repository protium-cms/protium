import config from '@protium/config'
import Knex from 'knex'

export default Knex({
  ...config.get('db'),
})
