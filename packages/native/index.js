const { KeepAwake, registerRootComponent } = require('expo')
const {App} = require('@protium/app/src/App.tsx')

if (__DEV__) {
  KeepAwake.activate()
}

registerRootComponent(App)
