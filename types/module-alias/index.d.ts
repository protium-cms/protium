import { addAlias } from "module-alias"

declare module 'module-alias' {
  export function addAlias(path: string, replacer: string | Function): typeof addAlias
}
