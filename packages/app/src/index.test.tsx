import {shallow} from 'enzyme'
import React from 'react'
import {App} from '.'

describe('app', () => {
  it('should export a component', () => {
    const component = shallow(<App />)
    expect(component).toBeDefined()
    // expect(2).toBe(3)
  })
})
