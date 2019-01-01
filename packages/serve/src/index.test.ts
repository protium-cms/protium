jest.mock('@protium/api/index', () => ({api: {listen: jest.fn()}}))
jest.mock('@protium/web/index', () => ({app: {listen: jest.fn()}}))

import {api} from '@protium/api/index'
import {app} from '@protium/web/index'
import '.'

describe('entrypoint', () => {
  it('app should start up', () => {
    expect(app.listen).toHaveBeenCalled()
  })
  it('api should start up', () => {
    expect(api.listen).toHaveBeenCalled()
  })
})
