import React from 'react'
import {AppRegistry, StyleSheet, View} from 'react-native'
import Logo from './components/Logo'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ccc',
    height: '100%',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
    width: '100%',
  },
})

export const App = () => {
  return <View style={styles.container}>
    <Logo />
  </View>
}

AppRegistry.registerComponent('App', () => App)
