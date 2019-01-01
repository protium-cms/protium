const Fs = require('fs')
const Path = require('path')
const {defaults: tsJest} = require('ts-jest/presets')

const projects = Fs.readdirSync(Path.resolve('packages'))
  .filter(p => !p.startsWith('.'))

const globalConfig = module.exports = {
  verbose: true,
  bail: false,
  projects: projects.map(configureProject)
}

function configureProject (pkg) {
  let c = {
    displayName: pkg,
    cacheDirectory: '.jest/cache',
    testEnvironment: 'node',
    preset: 'ts-jest',
    moduleNameMapper: {
      '^@protium/([\\w-]+)$': '<rootDir>/packages/$1/src',
      '^@protium/([\\w-]+)(\\/.*)?$': '<rootDir>/packages/$1/src/$2',
    },
    globals: {
      'ts-jest': {
        tsConfig: Path.resolve('packages', pkg, 'tsconfig.json'),
      },
    },
    testMatch: [
      `<rootDir>/packages/${pkg}/**/*.test.ts?(x)`
    ],
    transformIgnorePatterns: [
      "node_modules/(?!@protium)"
    ]
  }

  if (pkg === 'app') {
    return {
      ...c,
      ...tsJest,
      testMatch: c.testMatch,
      preset: 'react-native',
      setupFiles: [
        '<rootDir>/enzyme.config.ts'
      ],
      transform: {
        ...tsJest.transform,
        '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js'
      },
      transformIgnorePatterns: [
        "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@protium)"
      ],
    }
  }

  return c
}
