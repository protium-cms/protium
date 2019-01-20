const nyanProgress = require('nyan-progress')
const times = require('lodash/times')
const chalk = require('chalk')

module.exports = class NyanReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options
    this.progress = nyanProgress() // initialize
  }

  onTestStart(test) {
    // unused
  }

  onTestResult(test, testResult, aggregatedResult) {
    this.progress.tick()
  }

  onRunStart(results, options) {
    const cols = process.stdout.columns - 16
    this.progress.start({
      width: cols,
      total: results.numTotalTestSuites,
      renderThrottle: 120,
      message: {
        downloading: times(cols - 8).map(n => {
          return `\n\nTesting${times(n).map(x => '.').join('')}`
        }),
        finished: chalk.green.bold('\n\nPass!'),
        error: chalk.red.bold('\n\nFail!'),
      }
    })
  }

  onRunComplete(contexts, results) {
    this.progress.terminate()
    const { success, testResults } = results
    if (!success) {
      for (let result of testResults) {
        if (result.failureMessage) {
          console.log(result.failureMessage)
        }
      }
    }
  }
}
