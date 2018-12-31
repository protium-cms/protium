jest.mock('@protium/api/src')
jest.mock('@protium/web/src')

import api from '@protium/api/src'
import app from '@protium/web/src'

import './index'

describe('entrypoint', () => {
  it('app should start up', () => {
    expect(app.listen).toHaveBeenCalled()
  })
  it('api should start up', () => {
    expect(api.listen).toHaveBeenCalled()
  })
})
