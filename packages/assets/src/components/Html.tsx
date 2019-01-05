import React from 'react'
import {renderToString} from 'react-dom/server'
import {AppRegistry} from 'react-native-web'

interface IHtmlProps {
  appName: string
  initialProps?: any
}

export default function Html (props: IHtmlProps) {
  const {appName, initialProps} = props
  const {element, getStyleElement} = AppRegistry.getApplication(appName, {
    initialProps,
  })

  const html = renderToString(element)

  return <html>
    <head>
      {getStyleElement()}
    </head>
    <body>
      <div id='app-container' dangerouslySetInnerHTML={{__html: html}} />
      <script src='/assets/browser.bundle.js' />
    </body>
  </html>
}
