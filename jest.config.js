const Fs = require('fs')
const Path = require('path')
const { defaults: tsJest } = require('ts-jest/presets')
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig')
const omit = require('lodash/omit')

const projects = Fs.readdirSync(Path.resolve('packages'))
  .filter(p => !p.startsWith('.'))

// Filter out '*' ts module path
const modulePaths = Object.keys(compilerOptions.paths)
  .reduce((acc, key) => {
    if (key === '*') {
      return acc
    }
    acc[key] = compilerOptions.paths[key]
    return acc
  }, {})

module.exports = {
  verbose: true,
  bail: true,
  projects: projects.map(configureProject)
}

function configureProject(pkg) {
  let c = {
    displayName: pkg,
    cacheDirectory: '.jest/cache',
    testEnvironment: 'node',
    preset: 'ts-jest',
    setupTestFrameworkScriptFile: 'jest-mock-console/dist/setupTestFramework.js',
    moduleNameMapper: pathsToModuleNameMapper(omit(compilerOptions.paths, '*'), {
      prefix: '<rootDir>/'
    }),
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
        '<rootDir>/test/enzyme.config.ts'
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
