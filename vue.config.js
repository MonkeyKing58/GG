module.exports = {
  pwa: {
    name: 'GoodGame58 | Manager',
    themeColor: '#ffd000',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // настройки манифеста
    manifestOptions: {
      display: 'landscape',
      background_color: '#ffd000'
      // ...другие настройки манифеста...
    },

    iconPaths: {
      icon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  }
}