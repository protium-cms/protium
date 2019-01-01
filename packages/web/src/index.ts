import {getContext} from '@protium/assets/lib/utils'
import bodyParser from 'body-parser'
import compression from 'compression'
import Express from 'express'
import Path from 'path'

export const app = Express()

const assetContext = getContext('@protium/assets')
if (!assetContext) {
  throw new Error(`Can't find asset module`)
}
app.use(compression())
app.use(bodyParser.json({strict: true}))

app.use('/assets', Express.static(Path.resolve(assetContext, 'lib'), {
  fallthrough: true,
}))

app.get('/', (req, res) => {
  res.send(`
    <div id="app-container"></div>
    <script src="/assets/browser.bundle.js"></script>
  `)
})
