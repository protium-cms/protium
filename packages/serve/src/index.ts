import {api} from '@protium/api/index'
import {app} from '@protium/web/index'

const port = process.env.PORT || 3000
const apiPort = process.env.API_PORT || 3001

app.listen(port, () => {
  console.log(`[web] listening on port ${port}`)
})

api.listen(apiPort, () => {
  console.log(`[api] listening on port ${apiPort}`)
})
