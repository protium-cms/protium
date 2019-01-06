import {api} from '@protium/api'
import {app} from '@protium/web'
import Spdy from 'spdy'

import {mockCreateServer, mockListen} from './__mocks__/spdy'
import {handleApiStartup, handleAppStartup, options} from './index'

jest.mock('spdy')

describe('entrypoint', () => {

  it('should create api & app servers', () => {
    expect(Spdy.createServer).toHaveBeenCalledTimes(2)
    expect(mockCreateServer).toHaveBeenNthCalledWith(1, options, app)
    expect(mockCreateServer).toHaveBeenNthCalledWith(2, options, api)
  })

  it('should startup the servers by listening', () => {
    expect(mockListen).toHaveBeenCalledTimes(2)
    expect(mockListen).toHaveBeenNthCalledWith(1, 3000, handleAppStartup)
    expect(mockListen).toHaveBeenNthCalledWith(2, 3001, handleApiStartup)
  })

})
