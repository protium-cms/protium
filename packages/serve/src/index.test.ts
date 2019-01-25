import mockConsole from 'jest-mock-console'
mockConsole()

jest.mock('serve-favicon')
jest.mock('spdy')

import './index'

const {mockCreateServer, mockListen} = jest.requireMock('spdy')
describe('entrypoint', () => {
  it('should create api & app servers', () => {
    expect(mockCreateServer).toHaveBeenCalledTimes(2)
  })

  it('should startup app & api servers', () => {
    expect(mockListen).toHaveBeenCalledTimes(2)
  })
})
