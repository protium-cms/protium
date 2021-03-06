declare module 'react-native-web' {
  import {ReactElement} from 'react'
  import * as RN from 'react-native'

  interface IGetApplicationOptions {
    initialProps?: any
  }

  interface IGetApplicationType {
    element: ReactElement<any>
    getStyleElement (): ReactElement<any>
  }

  export namespace AppRegistry {
    const registerComponent: typeof RN.AppRegistry.registerComponent
    function getApplication (appName: string, options: IGetApplicationOptions): IGetApplicationType
  }
}
