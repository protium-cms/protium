#!/usr/bin/env ts-node
import Fs from 'fs'
import Path from 'path'
import {LoadResult, loadSync} from 'tsconfig'

const projectRoot = Path.resolve('.')
const packagesPath = Path.resolve('packages')

const config: any = {
  compilerOptions: {
    baseUrl: './',
    paths: {
      '*': [
        'types/*',
      ],
    },
  },
  extends: './tsconfig.settings.json',
}

const packages = Fs.readdirSync(packagesPath)
  .filter((n) => (!n.startsWith('.') && !n.startsWith('types')))

for (const name of packages) {
  const path = Path.join(packagesPath, name)
  const pkg = require(Path.join(path, 'package.json')) // tslint:disable-line
  const pkgLibGlob = Path.join(...pkg.name.split('/'), 'lib', '*')

  config.compilerOptions.paths[pkg.name] = [
    Path.join('./node_modules', pkg.name, 'src'),
  ]

  config.compilerOptions.paths[pkgLibGlob] = [
    Path.join('./node_modules', pkg.name, 'src', '*'),
  ]
}

Fs.writeFileSync(
  Path.join(projectRoot, 'tsconfig.json'),
  JSON.stringify(config, null, 2),
)

// const relatedDeps = Object.keys(pkg.dependencies)
//   .filter((dep) => packages.some((p: string) => p === `@protium/${p}`))
//   .map((dep) => dep.replace('@protium/', ''))
//   .map((dep) => Path.join('../', name, 'src'))
