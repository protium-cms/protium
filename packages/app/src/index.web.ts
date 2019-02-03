if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install() // tslint:disable-line
}

import {AppRegistry} from 'react-native'

const app = process.env.NODE_ENV !== 'production'
  ? require('./dev') // tslint:disable-line
  : require('./App') // tslint:disable-line

const App = app.App || app.default
AppRegistry.registerComponent('App', () => App)
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('app-container'),
})
