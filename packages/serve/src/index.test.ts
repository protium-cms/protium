jest.mock('@protium/web')
jest.mock('@protium/api')

import api from '@protium/api'
import app from '@protium/web'
import '.'

describe('entrypoint', () => {
  it('app should start up', () => {
    expect(app.listen).toHaveBeenCalled()
  })
  it('api should start up', () => {
    expect(api.listen).toHaveBeenCalled()
  })
})
