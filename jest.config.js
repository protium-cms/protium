const Fs = require('fs')
const Path = require('path')
const { defaults: tsJest } = require('ts-jest/presets')
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig')
const omit = require('lodash/omit')

// yuck. All except this one: `<rootDir>/node_modules/react-native`
const reactIgnorePatterns = [
  `<rootDir>/node_modules/expo-react-native-adapter/node_modules/react-native`,
  `<rootDir>/node_modules/lottie-react-native/node_modules/react-native`,
  `<rootDir>/node_modules/react-native-branch/node_modules/react-native`,
  `<rootDir>/node_modules/react-native-gesture-handler/node_modules/react-native`,
  `<rootDir>/node_modules/react-native-maps/node_modules/react-native`,
  `<rootDir>/node_modules/react-native-safe-module/node_modules/react-native`,
  `<rootDir>/node_modules/react-native-screens/node_modules/react-native`,
  `<rootDir>/node_modules/react-native-svg/node_modules/react-native`,
  `<rootDir>/node_modules/react-native-view-shot/node_modules/react-native`,
  `<rootDir>/packages/native/node_modules/react-native`,
]

const projects = Fs.readdirSync(Path.resolve('packages'))
  .filter(p => !p.startsWith('.'))

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
    setupFilesAfterEnv: ['jest-mock-console/dist/setupTestFramework.js'],
    moduleNameMapper: {
      ...pathsToModuleNameMapper(omit(compilerOptions.paths, '*'), {
        prefix: '<rootDir>/'
      })
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
      "node_modules/(?!@protium)",
    ],
    modulePathIgnorePatterns: [
      ".cache",
      ...reactIgnorePatterns,
    ]
  }

  if (pkg === 'app') {
    let cfg = {
      ...c,
      ...tsJest,
      testMatch: c.testMatch,
      preset: 'react-native',
      setupFiles: [
        '<rootDir>/packages/app/test/enzyme.config.ts'
      ],
      transform: {
        ...tsJest.transform,
        '\\.js$': 'babel-jest',
      },
      moduleNameMapper: {
        ...c.moduleNameMapper,
        // 'react-native': '<rootDir>/node_modules/react-native/$0'
      },
      transformIgnorePatterns: [
        "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@protium)"
      ],
    }

    return cfg
  }

  return c
}
