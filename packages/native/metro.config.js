const metro = require('metro')
const path = require('path')

module.exports = {
  resolver: {
    blacklistRE: metro.createBlacklist([
      /@protium\/app\/node_modules\/.*/
    ]),
    extraNodeModules: new Proxy({}, {
      get: (target, name) => path.join(process.cwd(), `node_modules/${name}`)
    })
  },
  watchFolders: [
    path.join(process.cwd(), '../app')
  ],
}

// const Path = require('path')
// const resolvePkg = require('resolve-pkg')

// const appPath = resolvePkg('@protium/app')
// console.log(appPath)
// const blacklisted = [
//   `/node_modules/expo-react-native-adapter/node_modules/react-native`,
//   `/node_modules/lottie-react-native/node_modules/react-native`,
//   `/node_modules/react-native-branch/node_modules/react-native`,
//   `/node_modules/react-native-gesture-handler/node_modules/react-native`,
//   `/node_modules/react-native-maps/node_modules/react-native`,
//   `/node_modules/react-native-safe-module/node_modules/react-native`,
//   `/node_modules/react-native-screens/node_modules/react-native`,
//   `/node_modules/react-native-svg/node_modules/react-native`,
//   `/node_modules/react-native-view-shot/node_modules/react-native`,
//   `/node_modules/react-native`,
// ]


// module.exports = {
//   // projectRoot: Path.resolve(__dirname, '../../'),
//   resolver: {
//     // blacklistRE: getBlacklistRE(),

//     // resolveRequest: (context, request, platform) =>  {
//     //   console.log('context', context)
//     //   console.log('request', request)
//     //   console.log('platorm', platorm)
//     //   // if (request.startsWith('./') || request.startsWith('/')) {
//     //   //   return require.resolve(Path.resolve(__dirname, request))
//     //   // }
//     //   return context.resolveRequest(context, request, platform)
//     // },
//     /**
//      * Add "global" dependencies for our RN project here so that our local components can resolve their
//      * dependencies correctly
//      */
//     extraNodeModules: {
//       '@protium/app': Path.relative(__dirname, appPath),
//       // "react-native": Path.resolve(__dirname, "node_modules/react-native"),
//       // "@storybook": Path.resolve(__dirname, "node_modules/@storybook")
//     },
//   },
// }

// console.log(module.exports)
// function getBlacklistRE() {
//   const regex = blacklisted
//     .map(s => s.replace(/\//g, '\\/'))
//     .join('|')
//   // console.log(regex)
//   return new RegExp(regex)
// }

// /*


//               /Users/jonjaques/Dev/protium/node_modules/react-native-svg/node_modules/react-native/package.json
// collides with /Users/jonjaques/Dev/protium/node_modules/react-native-view-shot/node_modules/react-native/package.json


// */
