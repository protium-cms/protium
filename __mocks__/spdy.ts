import {createServer, Server} from 'spdy'

export const mockListen = jest.fn()

export const mockServer = jest.fn<Server>(() => {
  return {listen: mockListen}
})

export const mockCreateServer = jest.fn<typeof createServer>(mockServer)

export default {
  createServer: mockCreateServer,
}
