import React from 'react'
import {renderToString} from 'react-dom/server'

export default function Html (props: any) {
  return <html>
    <body>
      <div id='app-container' dangerouslySetInnerHTML={{
        __html: renderToString(props.app),
      }} />
      <script src='/assets/browser.bundle.js' />
    </body>
  </html>
}
