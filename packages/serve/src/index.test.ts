import mockConsole from 'jest-mock-console'
mockConsole()

import {mockCreateServer, mockListen} from './__mocks__/spdy'
import './index'

describe('entrypoint', () => {
  it('should create api & app servers', () => {
    expect(mockCreateServer).toHaveBeenCalledTimes(2)
  })

  it('should startup app & api servers', () => {
    expect(mockListen).toHaveBeenCalledTimes(2)
  })
})
