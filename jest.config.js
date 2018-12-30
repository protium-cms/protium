const Fs = require('fs')
const Path = require('path')
const reactNativePreset = require('react-native/jest-preset.json')

// const { pathsToModuleNameMapper } = require('ts-jest/utils')
// const { compilerOptions } = require('./tsconfig.json')
const globalConfig = module.exports = {
  haste: reactNativePreset.haste,
  moduleNameMapper: {
    '^@protium/(.*)$': '<rootDir>/$1/src',
  },
  testEnvironment: 'node',
  verbose: true
}

globalConfig.projects = Fs.readdirSync(Path.resolve('packages'))
  .map(configureProject)

function configureProject (pkg) {
  const c = {
    bail: true,
    displayName: pkg,
    // testMatch: [
    //   `<rootDir>/packages/${pkg}/**/*.test.ts?(x)`
    // ],
    globals: {
      'ts-jest': {
        tsConfig: Path.resolve('packages', pkg, 'tsconfig.json'),
      },
    },
    preset: 'ts-jest',
    roots: [
      // `<rootDir>/`,
      `<rootDir>/packages/${pkg}/`,
    ]
  }

  if (pkg === 'app') {
    const assetTransformKey = Object.keys(reactNativePreset.transform)[1]
    const assetTransformVal = reactNativePreset.transform[assetTransformKey]
    // c.haste = reactNativePreset.haste
    c.moduleNameMapper = {
      ...globalConfig.moduleNameMapper,
      ...reactNativePreset.moduleNameMapper
    }
    c.modulePathIgnorePatterns = reactNativePreset.modulePathIgnorePatterns
    c.transformIgnorePatterns = reactNativePreset.transformIgnorePatterns
    c.transform = { [assetTransformKey]: assetTransformVal }
    c.setupFiles = [
      ...reactNativePreset.setupFiles,
      '<rootDir>/enzyme.config.ts'
    ]
    console.log(c)
  }

  return c
}

// {
//   "haste": {
//     "defaultPlatform": "ios",
//     "platforms": ["android", "ios", "native"],
//     "providesModuleNodeModules": [
//       "react-native"
//     ]
//   },
//   "moduleNameMapper": {
//     "^React$": "<rootDir>/node_modules/react"
//   },
//   "modulePathIgnorePatterns": [
//     "<rootDir>/node_modules/react-native/Libraries/react-native/"
//   ],
//   "transform": {
//     "^.+\\.js$": "babel-jest",
//     "^[./a-zA-Z0-9$_-]+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$": "<rootDir>/node_modules/react-native/jest/assetFileTransformer.js"
//   },
//   "transformIgnorePatterns": [
//     "node_modules/(?!(jest-)?react-native|react-clone-referenced-element)"
//   ],
//   "setupFiles": [
//     "<rootDir>/node_modules/react-native/jest/setup.js"
//   ],
//   "testEnvironment": "node"
// }
