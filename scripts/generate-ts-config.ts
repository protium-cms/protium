#!/usr/bin/env yarn ts-node --pretty -P tsconfig.settings.json
import Fs from 'fs'
import Path from 'path'
import {LoadResult, loadSync} from 'tsconfig'

const projectRoot = Path.resolve('.')
const packagesPath = Path.resolve('packages')
// const baseConfig = loadSync(projectRoot, 'tsconfig.settings.json')
const config: any = {
  extends: './tsconfig.settings.json',
  compilerOptions: {
    paths: {
      '*': [
        'types/*',
      ],
    },
  },
}

const packages = Fs.readdirSync(packagesPath)
  .filter((n) => (!n.startsWith('.') && !n.startsWith('types')))

for (const name of packages) {
  const path = Path.join(packagesPath, name)
  const pkg = require(Path.join(path, 'package.json')) // tslint:disable-line

  const paths = [
    Path.join('../', name, 'src'),
    // Path.join('..', name, 'lib'),
  ]

  const allPaths = [
    Path.join('../', name, 'src', '*'),
    // Path.join('..', name, 'lib', '*'),
  ]

  // config.compilerOptions.paths[Path.join('@protium', name, 'lib', '*')] = paths
  // config.compilerOptions.paths[Path.join('@protium', name, 'lib')] = paths
  config.compilerOptions.paths[Path.join('@protium', name)] = paths
  config.compilerOptions.paths[Path.join('@protium', name, 'lib', '*')] = allPaths
}

Fs.writeFileSync(
  Path.join(projectRoot, 'tsconfig.json'),
  JSON.stringify(config, null, 2),
)
