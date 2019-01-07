process
  .on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled promise rejection detected:')
    console.error(reason)
    console.error('Exiting to prevent bad state...')
    process.nextTick(() => process.exit(1))
  })
  .on('multipleResolves', (type, promise, reason) => {
    console.error('Multiple promise resolutions detected:')
    console.error(`  ${type}(${JSON.stringify(reason)})`)
    console.error('Exiting to prevent bad state...')
    process.nextTick(() => process.exit(1))
  })
