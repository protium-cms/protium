import React, {Component} from 'react'
import {Platform, Text, TouchableOpacity, View} from 'react-native'
import styled from 'styled-components/native'
import Logo from './components/Logo'

const Container = styled(View)`
  align-items: center;
  background-color: #CCC;
  height: 100%;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 100%;
`

export class App extends Component {
  public state = {count: 0, alive: false}
  public handlePress = () => {
    this.setState({count: this.state.count + 1})
    console.log('bar', this.state)
  }

  public componentDidMount () {
    this.checkAlive()
      .then((data) => this.setState({alive: true}))
      .catch((err) => this.setState({alive: false}))
  }
  public async checkAlive () {
    const baseUrl = 'https://api.protium.dev:3001'

    const res = await fetch(`${baseUrl}/heartbeat`, {
      mode: Platform.OS === 'web' ? 'cors' : 'no-cors',
    })

    if (!res.ok) {
      throw new Error('Not alive')
    }

    return await res.json()
  }

  public render () {
    return <Container>
      <Logo />
      <Text>Alive: {this.state.alive ? 'Yes' : 'No'}</Text>
      <TouchableOpacity onPress={this.handlePress}>
        <Text>Clicks: {this.state.count}</Text>
      </TouchableOpacity>
    </Container>
  }
}
