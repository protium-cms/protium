jest.mock('../app.ts')

import app from '../app'
import '../index'

describe('entrypoint', () => {
  it('should start up', () => {
    expect(app.listen).toHaveBeenCalled()
  })
})