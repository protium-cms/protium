jest.mock('@protium/web')

import app from '@protium/web'
import '../'

describe('entrypoint', () => {
  it('should start up', () => {
    expect(app.listen).toHaveBeenCalled()
  })
})