const Fs = require('fs')
const Path = require('path')
const { defaults: tsJest } = require('ts-jest/presets')

const globalConfig = module.exports = {
  cacheDirectory: '.jest/cache',
  testEnvironment: 'node',
  verbose: true,
  bail: true,
  projects: Fs.readdirSync(Path.resolve('packages'))
    .filter(p => !p.startsWith('.'))
    .map(configureProject)
}

function configureProject (pkg) {
  let c = {
    displayName: pkg,
    // moduleNameMapper: {
    //   '^@protium/([\\w-]+)$': '<rootDir>/packages/$1/src',
    //   '^@protium/([\\w-]+)(\\/.*)?$': '<rootDir>/packages/$1/src$2',
    // },
    globals: {
      'ts-jest': {
        tsConfig: Path.resolve('packages', pkg, 'tsconfig.json'),
      },
    },
    preset: 'ts-jest',
    testMatch: [
      `<rootDir>/packages/${pkg}/**/*.test.ts?(x)`
    ]
  }

  if (pkg === 'app') {
    c = {
      ...tsJest,
      preset: 'react-native',
      displayName: c.displayName,
      moduleNameMapper: c.moduleNameMapper,
      globals: c.globals,
      testMatch: c.testMatch,
      setupFiles: [
        '<rootDir>/enzyme.config.ts'
      ],
      transform: {
        ...tsJest.transform,
        '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js'
      }
    }
  }

  return c
}
