jest.mock('serve-favicon')

import {app} from '.'

describe('web', () => {
  it('should export an express-like object', () => {
    expect(typeof app.get).toBe('function')
  })
})
