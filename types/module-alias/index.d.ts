import { addAlias } from 'module-alias'

declare module 'module-alias' {
  type aliasFn = (fromPath: any, request: any, alias: any) => string
  export function addAlias (path: string, replacer: string | aliasFn): typeof addAlias
}
