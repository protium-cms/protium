import React from 'react'
import {AppRegistry, View} from 'react-native'
import styled from 'styled-components/native'
import Logo from './components/Logo'

const Container = styled(View)`
  align-items: center;
  background-color: #ccc;
  height: 100%;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 100%;
`

export const App = () => {
  return <Container>
    <Logo />
  </Container>
}

AppRegistry.registerComponent('App', () => App)
