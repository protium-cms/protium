require('offline-plugin/runtime').install() // tslint:disable-line

import {AppRegistry} from 'react-native'
import {App} from './index'

AppRegistry.registerComponent('App', () => App)
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('app-container'),
})
