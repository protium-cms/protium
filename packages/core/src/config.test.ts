import config from './config'

describe('config', () => {
  it('should export a config object', () => {
    expect(config).toBeDefined()
  })

  it('should be the "test" environment', () => {
    expect(config.get('env')).toBe('test')
  })
})
