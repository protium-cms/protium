import Fs from 'fs'
import Path from 'path'

export function getContext (pkg: string): string | null {
  const searchPaths = require.main!.paths
  const packagePaths = pkg.split('/')

  let context = null

  for (const path of packagePaths) {
    context = search(context ? [context] : searchPaths, path)
  }

  return context

  function search (haystack: string[], what: string): string | null {
    const stack = haystack.shift()
    if (stack) {
      if (!Fs.existsSync(stack)) {
        return search(haystack, what)
      }

      const needle = Fs.readdirSync(stack).find((path: string) => {
        return what === path
      })

      if (!needle) {
        return search(haystack, what)
      }

      return Path.join(stack, needle)
    }

    return null
  }
}
