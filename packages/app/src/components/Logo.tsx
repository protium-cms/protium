import React from 'react'
import {Text} from 'react-native'
import styled from 'styled-components/native'

const Protium = styled(Text)`
  color: #111;
  font-size: 50;
  font-weight: bold;
  text-align: center;
`

export default function Logo () {
  return <Protium>
    Protium
  </Protium>
}
