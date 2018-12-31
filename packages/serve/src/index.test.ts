import {api} from '@protium/api'
import {app} from '@protium/web'

jest.mock('@protium/api', () => ({api: {listen: jest.fn()}}))
jest.mock('@protium/web', () => ({app: {listen: jest.fn()}}))

import '.'

describe('entrypoint', () => {
  it('app should start up', () => {
    expect(app.listen).toHaveBeenCalled()
  })
  it('api should start up', () => {
    expect(api.listen).toHaveBeenCalled()
  })
})
