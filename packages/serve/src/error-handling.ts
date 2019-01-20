import {logger} from '@protium/core'

process
  .on('uncaughtException', (err) => {
    logger.warn('Unhandled exception detected: exiting to prevent bad state...')
    logger.error(err)
    process.nextTick(() => process.exit(1))
  })
  .on('unhandledRejection', (reason, promise) => {
    logger.warn('Unhandled promise rejection detected: exiting to prevent bad state...')
    logger.error(reason)
    process.nextTick(() => process.exit(1))
  })
  .on('multipleResolves', (type, promise, reason) => {
    logger.warn('Multiple promise resolutions detected: exiting to prevent bad state...')
    logger.error(`${type}(${JSON.stringify(reason)})`)
    process.nextTick(() => process.exit(1))
  })
