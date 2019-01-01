# Contributing

## New Package Checklist

The following steps are required when adding a new internal package:

1. Update `tsconfig.paths` using the convention as you find it.
    - When referencing individual files across modules, make sure to use `@protium/new-module/lib` as opposed to `src`. This is so when the project is built to JavaScript, the Node module resolution algoritm kicks in and files are referenced correctly.

2. Update `gitlab-ci.yml` `cache.paths` to include the new module's `node_modules`.
