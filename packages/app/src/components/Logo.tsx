import React from 'react'
import {StyleSheet, Text} from 'react-native'

const styles = StyleSheet.create({
  logo: {
    color: '#111',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default function Logo () {
  return <Text style={styles.logo}>
    Protium
  </Text>
}
