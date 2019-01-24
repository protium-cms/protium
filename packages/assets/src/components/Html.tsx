import React from 'react'
import {renderToString} from 'react-dom/server'
import {AppRegistry} from 'react-native-web'

interface IHtmlProps {
  appName: string
  initialProps?: any
}

const globalStyles = `
  html,
  body,
  #app-container,
  [data-reactroot],
  [data-reactroot] > div {height: 100%}
`

export default function Html (props: IHtmlProps) {
  const {appName, initialProps} = props
  const {element, getStyleElement} = AppRegistry.getApplication(appName, {
    initialProps,
  })

  const html = renderToString(element)

  return <html lang='en'>
    <head>
      <title>Protium</title>
      <meta charSet='utf8' />
      <meta name='theme-color' content='#ccc' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content='A universal app for awesomeness' />
      <link rel='manifest' href='/assets/manifest.json' />
      <script async src='/assets/browser.bundle.js' />
      <style id='global-styles' dangerouslySetInnerHTML={{__html: globalStyles}} />
      {getStyleElement()}
    </head>
    <body>
      <div id='app-container' dangerouslySetInnerHTML={{__html: html}} />
    </body>
  </html>
}
