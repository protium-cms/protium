# Protium

[![pipeline status](https://gitlab.com/protium-network/protium/badges/master/pipeline.svg)](https://gitlab.com/protium-network/protium/commits/master)
[![coverage report](https://gitlab.com/protium-network/protium/badges/master/coverage.svg)](https://gitlab.com/protium-network/protium/commits/master)

## Contributing

See the [guide](./CONTRIBUTING.md).

## Development

### Dependencies

- [Docker](https://www.docker.com/get-started) (optional)
- [Node Version Manager](https://github.com/creationix/nvm)
- [Yarn Package Manager](https://yarnpkg.com/en/docs/getting-started)

### Setup

1. Clone the repository and `cd` into it.
2. Make sure you're on the correct version of node by running:
    ```console
    $ nvm install && nvm use
    --> installs the right node & switches path to use it
    ```
3. Bootstrap the project.
    ```console
    $ yarn bootstrap
    --> install dependencies and symlink packages
    ```
4. Run the tests to make sure everything is setup correctly.
    ```console
    $ yarn test
    --> run the test suite
    ```
5. Run the dev script to get hacking!
    ```console
    $ yarn dev
    --> run a web development server
    ```
6. Profit!

### Tools

#### Yarn/Lerna

This project uses a [monorepo format](https://danluu.com/monorepo/), where individual packages are housed within the same repository. We use [Lerna](https://github.com/lerna/lerna#about) to manage dependencies between project packages, which in turn uses [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) feature to wire it all up.

##### Bootstrapping the project

When first cloning the repo, an additional step is needed to setup all the interproject dependencies. This is simplified into one command via a package script.

```console
$ yarn bootstrap
--> equivalent to `yarn && lerna bootstrap`
```

##### Adding a dependency to multiple packages

```console
$ yarn lerna add lodash
--> adds dependency to all packages
```

```console
$ yarn lerna add lodash --scope @protium/app --scope @protium/web
--> adds to the scoped packages
```

##### Adding a internal dependency to another internal package

*Note: this only works for one target dependency at a time*

```console
$ yarn lerna add @protium/new-package --scope @protium/app
--> same as above, but also symlinks new package
```

##### Adding external dependencies to a package

```console
$ yarn workspace @protium/app add redux react-redux
--> same as yarn add but with context of a workspace
```

##### Adding a dependency to the root package

```console
$ yarn add -D -W some-dependency
--> tells yarn to add the dep to the root package
```

#### VSCode

The owner of this project likes to use Microsoft's [Visual Studio Code](https://code.visualstudio.com/) for project development, as it supports nice things like like Intellisense, debugging and the rest all in one integrated development environment.

Of course, *feel free to use whatever editor you prefer*, but as a convenience—we ship a preconfigured workspace as well as some tasks and debugger configurations to aid in development.

##### Extensions

- [TypeScript TSLint Plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
- [tsfmt - TypeScript Formatter](https://marketplace.visualstudio.com/items?itemName=eternalphane.tsfmt-vscode)
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig)
- [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
