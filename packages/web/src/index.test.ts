import {app} from '.'

jest.mock('@protium/assets/lib/middleware')

describe('app', () => {
  it('should export an express-like object', () => {
    expect(typeof app.get).toBe('function')
  })
})
