module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV)

  return {
    presets: ["module:metro-react-native-babel-preset"]
  }
}
