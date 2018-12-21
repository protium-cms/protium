import app from '../app'

describe('app', () => {
  it('should export an express-like object', () => {
    expect(typeof app.get).toBe('function')
  })
})