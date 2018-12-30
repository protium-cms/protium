jest.mock('@protium/web')

import app from '@protium/web'
import '../'

describe('entrypoint', () => {
  it('should start up', () => {
    expect(app.listen).toHaveBeenCalled()
  })

  it('should fail', () => {
    expect(1).toBe(2)
  })
})
