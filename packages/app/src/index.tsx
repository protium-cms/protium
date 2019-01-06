import React from 'react'
import {hot} from 'react-hot-loader/root'
import {View} from 'react-native'
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

export const App = hot(Application)

function Application () {
  return <Container>
    <Logo />
  </Container>
}
