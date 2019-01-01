import {getContext} from '@protium/assets/utils'
import Express from 'express'
import Path from 'path'

export const app = Express()

const assetContext = getContext('@protium/assets/dist')
if (!assetContext) {
  throw new Error(`Can't find asset directory`)
}

app.use('/assets', Express.static(Path.resolve(assetContext), {
  fallthrough: true,
}))

app.get('/', (req, res) => {
  res.send(`
    <div id="app-container"></div>
    <script src="/assets/browser.bundle.js"></script>
  `)
})
