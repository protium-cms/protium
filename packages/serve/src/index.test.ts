jest.mock('@protium/api')
jest.mock('@protium/web')

import api from '@protium/api'
import app from '@protium/web'

import './index'

describe('entrypoint', () => {
  it('app should start up', () => {
    expect(app.listen).toHaveBeenCalled()
  })
  it('api should start up', () => {
    expect(api.listen).toHaveBeenCalled()
  })
})
