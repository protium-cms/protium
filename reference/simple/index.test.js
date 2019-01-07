const index = require('./index')

describe('reference app', () => {
  it('should pass the test', () => {
    expect(index).toBe(42)
  })
})
