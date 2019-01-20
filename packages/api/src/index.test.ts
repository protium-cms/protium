import api from '.'

describe('api', () => {
  it('should export an express-like object', () => {
    expect(typeof api.get).toBe('function')
  })
})
